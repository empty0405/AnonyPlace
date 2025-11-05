import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async likePost(@Request() req, @Body() body: { postId: string }) {
    return this.likeService.likePost(req.user.id, body.postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async unlikePost(@Request() req, @Param('postId') postId: string) {
    return this.likeService.unlikePost(req.user.id, postId);
  }

  @Get('post/:postId')
  async getPostLikes(@Param('postId') postId: string) {
    return this.likeService.getPostLikes(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('post/:postId/check')
  async checkLike(@Request() req, @Param('postId') postId: string) {
    const liked = await this.likeService.checkUserLike(
      req.user.id,
      postId,
    );
    return { liked };
  }
}
