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
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Request() req,
    @Body() body: { postId: string; content: string },
  ) {
    return this.commentService.createComment(
      req.user.id,
      body.postId,
      body.content,
    );
  }

  @Get('post/:postId')
  async getPostComments(@Param('postId') postId: string) {
    return this.commentService.getPostComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Request() req, @Param('id') commentId: string) {
    return this.commentService.deleteComment(commentId, req.user.id);
  }
}
