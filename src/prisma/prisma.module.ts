import { Module, Global } from '@nestjs/common';
import { PrismaService } from './primas.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}