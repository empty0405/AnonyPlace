import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MembershipService } from './membership.service';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyMemberships(@Request() req) {
    return this.membershipService.getUserMemberships(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(
    @Request() req,
    @Body() body: { creatorId: string; tierId: string },
  ) {
    return this.membershipService.createMembership(
      req.user.id,
      body.creatorId,
      body.tierId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelMembership(@Request() req, @Param('id') membershipId: string) {
    return this.membershipService.cancelMembership(
      membershipId,
      req.user.id,
    );
  }
}
