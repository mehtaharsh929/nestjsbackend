import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users (Admin-only access)
  @Get()
  @Roles("admin") // Only 'admin' role can access this route
  @UseGuards(JwtAuthGuard, RolesGuard) // Guard to ensure only admins can access
  findAll() {
    return this.usersService.findAll();
  }

  // Get a specific user by ID (Admin-only access)
  @Get(":id")
  @Roles("admin") // Only 'admin' role can access this route
  @UseGuards(JwtAuthGuard, RolesGuard) // Use JwtAuthGuard to authenticate, RolesGuard to check roles
  findOne(@Param("id") id: number) {
    return this.usersService.findById(id);
  }

  // Create a new user (Admin-only access)
  @Post()
  @Roles("admin") // Only 'admin' role can access this route
  @UseGuards(JwtAuthGuard, RolesGuard) // Use JwtAuthGuard to authenticate, RolesGuard to check roles
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Update user details (Admin-only access)
  @Patch(":id")
  @Roles("admin") // Only 'admin' role can access this route
  @UseGuards(JwtAuthGuard, RolesGuard) // Use JwtAuthGuard to authenticate, RolesGuard to check roles
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Delete a user (Admin-only access)
  @Delete(":id")
  @Roles("admin") // Only 'admin' role can access this route
  @UseGuards(JwtAuthGuard, RolesGuard) // Use JwtAuthGuard to authenticate, RolesGuard to check roles
  remove(@Param("id") id: number) {
    return this.usersService.remove(id);
  }
}
