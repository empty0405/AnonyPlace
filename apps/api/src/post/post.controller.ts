import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024 * 1024, // 5GB
      },
      fileFilter: (req, file, cb) => {
        // Accept video and image files (frontend may send images as thumbnails)
        if (!file.mimetype.startsWith('video/') && !file.mimetype.startsWith('image/')) {
          return cb(new Error('Only video or image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createPost(
    @Request() req,
    @Body() createDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Allow creating text-only posts. Determine creatorId from payload or authenticated user.
    let creatorId = createDto.creatorId;

    if (!creatorId) {
      const creator = await this.postService.getCreatorByUserId(req.user.id);
      if (!creator) {
        throw new HttpException('Creator profile not found for user', HttpStatus.BAD_REQUEST);
      }
      creatorId = creator.id;
    }

    // Verify user owns the creator
    const creator = await this.postService.getCreatorById(creatorId);
    if (creator.userId !== req.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    const payload: any = {
      ...createDto,
      creatorId,
    };

    if (file) {
      payload.videoPath = file.path;
      payload.videoSize = file.size;
      payload.videoMimeType = file.mimetype;
    }

    return this.postService.createPost(payload);
  }

  @Get()
  async getAllPosts(@Request() req, @Query() query) {
    const userId = req.user?.id;
    return this.postService.getAllPosts(userId, query);
  }

  @Get(':id')
  async getPost(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.postService.getPostById(id, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updatePost(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    const post = await this.postService.getPostById(id);
    const creator = await this.postService.getCreatorById(post.creatorId);

    if (creator.userId !== req.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.postService.updatePost(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePost(@Request() req, @Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    const creator = await this.postService.getCreatorById(post.creatorId);

    if (creator.userId !== req.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.postService.deletePost(id);
  }

  @Get(':id/stream')
  async getStreamUrl(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.postService.getStreamUrl(id, userId);
  }
}
