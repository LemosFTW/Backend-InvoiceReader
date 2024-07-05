import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from './prisma/primas.service'; // Importe o serviço Prisma
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [PrismaModule, MulterModule.register({
    dest: './uploads',
  }),
  AuthModule
] ,
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}




