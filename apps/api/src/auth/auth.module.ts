import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PatreonStrategy } from './patreon.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'changeme',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d' 
        },
      }),
    }),
  ],
  providers: [AuthService, PatreonStrategy, PrismaService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
