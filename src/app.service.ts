import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma/primas.service'; // Importe o serviço Prisma
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  private async getUser(userEmail: string) {
    let user = await this.prisma.user.findUnique({
      where: { email: userEmail }
    });
    return user;
  }

  async invoices() {
    let invoices = await this.prisma.invoice.findMany();

    let invoicesFiltered = invoices.map((invoice) => { return invoice.filename; });
    return invoicesFiltered;
  }

  
  async updateInvoiceContent(body: { fileName: string; email: string; content: string; }, id: number): Promise<string> {
    let user = await this.getUser(body.email);

    if (user === null)
      return 'error';

    if (user.email !== body.email)
      return 'error';

    let invoice = await this.prisma.invoice.findUnique({
      where: { id: id }
    });

    if (invoice === null)
      return 'error';

    if (invoice.userId !== user.id)
      return 'error';

    await this.prisma.invoice.update({
      where: { id: id },
      data: {
        extractedText: body.content
      }
    });

    return 'success';
  }



  async deleteInvoice(body: { email: string; }, idToDelete: number): Promise<string> {
    try {

      let user = await this.getUser(body.email);

      if (user === null)
        return 'error';

      let invoice = await this.prisma.invoice.findUnique({
        where: { id: idToDelete }
      });

      if (invoice === null)
        return 'error';

      if (invoice.userId !== user.id)
        return 'error';

      await this.prisma.invoice.delete({
        where: { id: idToDelete }
      });

      return 'success';
    }
    catch (error) {
      console.error('Erro ao deletar invoice:', error);
      return 'fail';
    }
  }


  async getInvoices(body: { email: string; }): Promise<any> {
    try {
      let user = await this.getUser(body.email);

      if (user === null)
        return 'error';

      if (user.email !== body.email)
        return 'error';

      let invoices = await this.prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { id: 'asc' }
      });

      let invoicesFiltered = invoices.map((invoice) => {
        return { id: invoice.id, filename: invoice.filename, extractedText: invoice.extractedText };
      });

      return invoicesFiltered;
    } catch (error) {
      console.error('Erro ao buscar invoices:', error);
      return 'fail';
    }
  }

  async uploadInvoice(file: Express.Multer.File, email: string): Promise<string> {
    try {
      if (!file) {
        console.error('Arquivo não encontrado');
        return 'error';
      }

      let user = await this.getUser(email);

      if (user === null)
        return 'error';

      if (user.email !== email)
        return 'error';



      const buffer = await fs.readFile(file.path);


      /*
      id            Int
      userId        Int
      filename      String
      file          Bytes
      extractedText String
      uploadDate    DateTime 
      user          User     
      */


      await this.prisma.invoice.create({
        data: {
          filename: file.originalname as string,
          file: buffer as Buffer,
          userId: user.id as number,
          extractedText: "",

        }
      });

      await fs.unlink(file.path);

      return 'success';
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw new Error('Falha ao fazer upload do arquivo');
    }
  }


  async updateInvoice(body: { fileName: string; userEmail: string; content: string; }): Promise<string> {
    try {
      let user = await this.getUser(body.userEmail);

      if (user === null)
        return 'error';

      if (user.email !== body.userEmail)
        return 'error';

      let invoice = await this.prisma.invoice.findMany({
        where: { filename: body.fileName }
      });



      if (invoice.length === 0)
        return 'error';

      let find = false;

      for (let i = 0; i < invoice.length; i++) {
        if (invoice[i].userId !== user.id)
          continue;

        find = true;

        await this.prisma.invoice.update({
          where: { id: invoice[i].id },
          data: {
            extractedText: body.content
          }
        });
      }



      if (!find)
        return 'error';
      else
        return 'success';

    } catch (error) {
      console.error('Erro ao atualizar invoice:', error);
      return 'fail';
    }
  };

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


