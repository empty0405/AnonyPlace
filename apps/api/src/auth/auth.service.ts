import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any): Promise<any> {
    const patreonId = profile.id;
    const email = profile.emails?.[0]?.value || profile.email || `${profile.id}@patreon.user`;
    
    let user = await this.prisma.user.findUnique({ where: { patreonId } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          patreonId,
          email,
          patreonConnectedAt: new Date(),
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          patreonConnectedAt: new Date(),
        },
      });
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createTestUser(email: string, role: 'FAN' | 'CREATOR' = 'FAN') {
    const user = await this.prisma.user.create({
      data: {
        email,
        role,
      },
    });

    // If creating a CREATOR user, also create the creator profile
    if (role === 'CREATOR') {
      await this.prisma.creator.create({
        data: {
          userId: user.id,
          displayName: email.split('@')[0],
          bio: 'Test creator account',
          isAdult: false,
        },
      });
    }

    return user;
  }
}
