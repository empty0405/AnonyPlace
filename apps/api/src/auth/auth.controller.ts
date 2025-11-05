import { Controller, Get, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('patreon')
  @UseGuards(AuthGuard('patreon'))
  async patreonLogin() {
    // initiates the Patreon OAuth2 login flow
  }

  @Get('patreon/callback')
  @UseGuards(AuthGuard('patreon'))
  async patreonCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.login(req.user);
    
    // Redirect to frontend with token in query parameter
    const frontendUrl = process.env.FRONTEND_URL || 'https://turbo-meme-jjqj97vrrvwwf5w5w-80.app.github.dev';
    res.redirect(`${frontendUrl}/?token=${accessToken}`);
  }

  // Development/Testing endpoint - create test user and get token
  @Post('test-login')
  async testLogin(@Body() body: { email: string; role?: 'FAN' | 'CREATOR' }) {
    const { email, role = 'FAN' } = body;
    
    // Find or create test user
    let user = await this.authService.findUserByEmail(email);
    
    if (!user) {
      user = await this.authService.createTestUser(email, role);
    }
    
    // Generate JWT token
    const { accessToken } = await this.authService.login(user);
    
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
