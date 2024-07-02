import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma/primas.service'; // Importe o serviço Prisma
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  async uploadInvoice(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        console.error('Arquivo não encontrado');
        return 'error';
      }

      //TODO: verificar se o usuario existe na bd

      // Lê o arquivo como um buffer
      const buffer = await fs.readFile(file.path);

      /*
      id            Int      @id @default(autoincrement())
      userId        Int
      imageUrl      String
      filename      String
      file          Bytes
      extractedText String
      uploadDate    DateTime @default(now())
      user          User     @relation(fields: [userId], references: [id])
      
      */





      // await this.prisma.invoice.create({

      //   data: {
      //     userId,
      //     imageUrl: file.path,
      //     filename: file.originalname,
      //     file: buffer, // Salva o conteúdo do arquivo como buffer
      //     uploadDate: new Date(),
      //   },
      // });





      // Remova o arquivo temporário do sistema de arquivos após salvar no banco de dados
      await fs.unlink(file.path);

      return 'success';
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw new Error('Falha ao fazer upload do arquivo');
    }
  }



  async getInvoices(): Promise<string[]> {
    let invoices = this.prisma.invoice.findMany();


    console.log(invoices);
    return null;
  }


  async getUsers(): Promise<any> {
    let users = (await this.prisma.user.findMany());
    let usersFiltered = users.map((user) => {
      return user.email;
    });
    return usersFiltered;
  }

  async createUser(body: { data: { email: string; name: string; }; }): Promise<string> {
    try {
      if (this.prisma.user.findUnique({ where: { email: body.data.email } }))
        return 'success';

      if (body.data.email === '' || body.data.name === '')
        return 'fail'


      await this.prisma.user.create({
        data: {
          email: body.data.email,
          name: body.data.name,
        },
      });

      return 'success';
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return 'fail'
    }
  }
}


