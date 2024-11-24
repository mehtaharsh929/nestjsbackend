import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service'; // or wherever you fetch users

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService, // Inject your user service
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: process.env.JWT_SECRET, // The secret used to verify JWTs
    });
  }

  async validate(payload: any) {
    // Find the user by the id stored in the JWT token (payload.id)
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // This user will be added to the request object
  }
}
