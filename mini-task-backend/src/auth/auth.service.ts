import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import {hash, compare} from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto){
        const registeredUser = await this.prisma.user.findUnique({
            where: {email: loginDto.email}
        });
        if(!registeredUser || !registeredUser.password){
            throw new UnauthorizedException("Invalid Email or password")
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            registeredUser.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: registeredUser.id,
            email: registeredUser.email,
        };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }

    }

    async register(registerDto: RegisterDto){
        const existingUser = await this.prisma.user.findUnique({
            where: {email: registerDto.email}
        });

        if(existingUser){
            throw new ConflictException("Email already exists");
        }
        const hashedPassword = await hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: registerDto.name,
                email: registerDto.email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return user;

    }  
}
