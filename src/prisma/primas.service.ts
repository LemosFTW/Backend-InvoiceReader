import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(); // Chama o construtor da classe base PrismaClient
  }

  async onModuleInit() {
    await this.$connect(); // Conecta ao banco de dados Prisma
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Desconecta do banco de dados Prisma
  }
}