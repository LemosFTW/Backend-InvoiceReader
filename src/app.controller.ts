import { Controller, Get,UploadedFile, Post,UseInterceptors,Req,HttpException, HttpStatus, Body, Patch, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}





  @Post('invoices')
  async getInvoice(@Body() body): Promise<any> {
    return await this.appService.getInvoices(body);
  }


  @Get('invoices')
  async getInvoices(): Promise<any> {
    return await this.appService.invoices();
  }


  @HttpCode(200)
  @Patch('upload')
  async updateInvoice(@Body() body): Promise<string> {
    let result = await this.appService.updateInvoice(body);

    if (result === 'error') 
      throw new HttpException('Failed to update invoice', HttpStatus.BAD_REQUEST);

    if (result === 'fail') 
      throw new HttpException('Failed to update invoice', HttpStatus.INTERNAL_SERVER_ERROR);

      return 'success';

  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadInvoice(@UploadedFile() file: Express.Multer.File, @Body('userEmail') userEmail : string): Promise<string>{
    try {
      const result = await this.appService.uploadInvoice(file, userEmail);
      if (result === 'error') 
        //404
        throw new HttpException('Failed to upload file', HttpStatus.BAD_REQUEST);
      
      return 'success';
    } catch (error) {
      //500
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('users')
  async getUsers():Promise<any> {
    return await this.appService.getUsers();
  }

  @Post('users')
  async createUser(@Body() body):Promise<string> {
    let result = await this.appService.createUser(body);

    if (result === 'error') 
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);

    if (result === 'fail') 
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);

      return 'success';

  }
}
