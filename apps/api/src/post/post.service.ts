import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('video-processing') private videoQueue: Queue,
  ) {}

  async createPost(createDto: any) {
    const {
      creatorId,
      title,
      description,
      tierId,
      videoPath,
      videoSize,
      videoMimeType,
      thumbnailUrl,
      isPublic,
    } = createDto;

    // Create post record with actual schema fields
    const post = await this.prisma.post.create({
      data: {
        creatorId,
        title,
        body: description,
        visibility: isPublic === 'true' ? 'PUBLIC' : 'TIER',
        thumbnail: thumbnailUrl,
      },
      include: {
        creator: true,
      },
    });

    // If a file was uploaded, create an Asset record and update thumbnail for images
    if (videoPath) {
      const isImage = videoMimeType?.startsWith('image/');

      await this.prisma.asset.create({
        data: {
          postId: post.id,
          type: isImage ? 'IMAGE' : 'VIDEO',
          s3Key: videoPath,
        },
      });

      if (isImage) {
        // Store the uploaded image path as the post thumbnail
        await this.prisma.post.update({ where: { id: post.id }, data: { thumbnail: videoPath } });
        post.thumbnail = videoPath;
      } else {
        // For videos, enqueue processing (transcoding, thumbnails)
        try {
          await this.videoQueue.add('process', { postId: post.id, path: videoPath });
        } catch (err) {
          // queue errors shouldn't block post creation
          console.warn('Failed to enqueue video processing job', err);
        }
      }
    }

    // Return post with creator and assets
    const full = await this.prisma.post.findUnique({
      where: { id: post.id },
      include: { creator: true, assets: true, tiers: true },
    });

    // Normalize thumbnailUrl for client
    const rawThumb = full.thumbnail || null;
      // Serve thumbnails through the API proxy path (/api/uploads/...) so nginx forwards correctly
      const thumbPath = rawThumb
        ? `/api/${rawThumb.replace(/^\.\//, '').replace(/^\//, '')}`
        : null;

    return {
      ...full,
      thumbnailUrl: thumbPath,
    };
  }

  async getPostById(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        creator: true,
        tiers: true,
        assets: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check access permission
    const hasAccess = await this.checkAccess(post, userId);

    return {
      ...post,
      hasAccess,
    };
  }

  async updatePost(id: string, updateDto: any) {
    return this.prisma.post.update({
      where: { id },
      data: updateDto,
    });
  }

  async deletePost(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async getStreamUrl(postId: string, userId?: string) {
    const post = await this.getPostById(postId, userId);

    if (!post.hasAccess) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    // TODO: Check asset status
    // Return HLS manifest URL from assets
    return {
      streamUrl: `/media/${postId}/playlist.m3u8`,
      thumbnailUrl: post.thumbnail,
    };
  }

  async getAllPosts(userId?: string, query?: any) {
    const { limit, trending } = query || {};

    const posts = await this.prisma.post.findMany({
      include: {
        creator: true,
        _count: {
          select: { likes: true, comments: true },
        },
        assets: true,
        tiers: true,
      },
      orderBy: { created_at: 'desc' },
      take: limit ? Number(limit) : undefined,
    });

    // For simplicity, treat trending same as recent for now.
    // Filter assets based on access like getCreatorPosts
    let userMemberships = [];
    if (userId) {
      userMemberships = await this.prisma.membership.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { tier: true },
      });
    }

    return posts.map((post) => {
      const postTierIds = post.tiers.map((t: any) => t.id);
      const hasAccess =
        post.visibility === 'PUBLIC' ||
        postTierIds.length === 0 ||
        userMemberships.some((m) => postTierIds.includes(m.tierId));

      // Normalize thumbnail URL to be client-consumable (serve from /uploads)
      const rawThumb = post.thumbnail || null;
        const thumbPath = rawThumb
          ? `/api/${rawThumb.replace(/^\.\//, '').replace(/^\//, '')}`
          : null;

      return {
        ...post,
        thumbnailUrl: thumbPath,
        hasAccess,
        assets: hasAccess ? post.assets : [],
      };
    });
  }

  async getCreatorById(id: string) {
    const creator = await this.prisma.creator.findUnique({
      where: { id },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async getCreatorByUserId(userId: string) {
    return this.prisma.creator.findUnique({ where: { userId } });
  }

  private async checkAccess(post: any, userId?: string): Promise<boolean> {
    // Public posts are accessible to everyone
    if (post.visibility === 'PUBLIC') return true;

    // No tier required
    if (!post.tiers || post.tiers.length === 0) return true;

    // Must be authenticated
    if (!userId) return false;

    // Get user's active membership for this post's tiers
    const postTierIds = post.tiers.map((t: any) => t.id);
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        tierId: { in: postTierIds },
        status: 'ACTIVE',
      },
    });

    return !!membership;
  }
}
