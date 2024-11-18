import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, username, password } = registerDto;

        try {
            // Check if user already exists
            const existingUser = await this.userRepository.findOne({
                where: [{ email }, { username }],
            });

            if (existingUser) {
                throw new ConflictException('Email or username already exists');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the new user
            const user = this.userRepository.create({
                email,
                username,
                password: hashedPassword,
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error; // Rethrow known errors
            }

            // Handle unexpected errors
            console.error('Register error:', error); // Log the actual error
            throw new BadRequestException('Unable to register the user');
        }
    }


    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return { token };
    }
}
