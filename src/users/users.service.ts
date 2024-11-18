import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // Get all users
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Get a user by ID
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Create a new user
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, username, password, role } = createUserDto;

        try {
            // Check if a user with the given email or username already exists
            const existingUser = await this.userRepository.findOne({
                where: [{ email }, { username }],
            });

            if (existingUser) {
                throw new ConflictException('Email or username already exists');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user object
            const newUser = this.userRepository.create({
                email,
                username,
                password: hashedPassword,
                role, // Include role if necessary
            });

            // Save the user to the database
            return await this.userRepository.save(newUser);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error; // Rethrow known conflict errors
            }

            // Handle other unexpected errors
            console.error('Error while creating user:', error); // Log the actual error for debugging
            throw new BadRequestException('Failed to create user');
        }
    }

    // Update an existing user
    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { email, username, password, ...rest } = updateUserDto;

        try {
            const user = await this.findById(id);

            // Check if the email is being updated and if it already exists for another user
            if (email && email !== user.email) {
                const existingUserWithEmail = await this.userRepository.findOne({
                    where: { email },
                });

                if (existingUserWithEmail && existingUserWithEmail.id !== id) {
                    throw new ConflictException('Email is already in use by another user');
                }
            }

            // Check if the username is being updated and if it already exists for another user
            if (username && username !== user.username) {
                const existingUserWithUsername = await this.userRepository.findOne({
                    where: { username },
                });

                if (existingUserWithUsername && existingUserWithUsername.id !== id) {
                    throw new ConflictException('Username is already in use by another user');
                }
            }

            // If the password is being updated, hash it
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            // Merge other updates into the user object
            Object.assign(user, { ...rest, email, username });

            // Save the updated user to the database
            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error; // Rethrow known conflict errors
            }

            // Handle unexpected errors
            console.error('Error while updating user:', error); // Log the actual error
            throw new BadRequestException('Failed to update user');
        }
    }
    // Remove a user
    async remove(id: number): Promise<void> {
        const user = await this.findById(id);
        await this.userRepository.remove(user);
    }
}
