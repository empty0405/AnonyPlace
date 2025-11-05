import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TierService } from './tier.service';
import { CreatorService } from '../creator/creator.service';

@Controller('tier')
export class TierController {
  constructor(
    private readonly tierService: TierService,
    private readonly creatorService: CreatorService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserTiers(@Request() req) {
    const creator = await this.creatorService.getCreatorByUserId(req.user.id);
    if (!creator) {
      throw new HttpException('Creator profile not found', HttpStatus.NOT_FOUND);
    }
    return this.tierService.getTiersByCreatorId(creator.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTier(@Request() req, @Body() createDto: any) {
    const creator = await this.creatorService.getCreatorByUserId(req.user.id);
    if (!creator) {
      throw new HttpException('Creator profile not found', HttpStatus.NOT_FOUND);
    }

    return this.tierService.createTier({
      ...createDto,
      creatorId: creator.id,
    });
  }

  @Get(':id')
  async getTier(@Param('id') id: string) {
    return this.tierService.getTierById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateTier(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    const tier = await this.tierService.getTierById(id);
    const creator = await this.creatorService.getCreatorById(tier.creatorId);
    
    if (creator.userId !== req.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.tierService.updateTier(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTier(@Request() req, @Param('id') id: string) {
    const tier = await this.tierService.getTierById(id);
    const creator = await this.creatorService.getCreatorById(tier.creatorId);
    
    if (creator.userId !== req.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    return this.tierService.deleteTier(id);
  }
}
