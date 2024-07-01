import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/prisma/primas.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUsers() {
        return this.prisma.user.findMany();
    }

    async createUser(data: { name: string; email: string }) {
        return this.prisma.user.create({
            data,
        });
    }
}