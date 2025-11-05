import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatorService } from './creator.service';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  async getAllCreators() {
    return this.creatorService.getAllCreators();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCreator(@Request() req, @Body() createDto: any) {
    return this.creatorService.createCreator(req.user.id, createDto);
  }

  @Get(':id')
  async getCreator(@Param('id') id: string) {
    return this.creatorService.getCreatorById(id);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateCreator(
    @Request() req,
    @Body() updateDto: any,
  ) {
    // Find creator by userId
    const creator = await this.creatorService.getCreatorByUserId(req.user.id);
    if (!creator) {
      throw new HttpException('Creator profile not found', HttpStatus.NOT_FOUND);
    }

    return this.creatorService.updateCreator(creator.id, updateDto);
  }

  @Get(':id/posts')
  async getCreatorPosts(
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.creatorService.getCreatorPosts(id, userId);
  }
}
