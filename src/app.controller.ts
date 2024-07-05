import { Controller, Get,UploadedFile, Post,UseInterceptors,Req,HttpException, HttpStatus, Body, Patch, HttpCode,Delete, Param, ParseIntPipe, Put,UseGuards  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Delete('invoices/:id')
  async deleteInvoice(@Body() body, @Param('id', new ParseIntPipe()) id): Promise<any> {
    let result = await this.appService.deleteInvoice(body,id);
    //TODO: check the error code
    if (result === 'error') 
      throw new HttpException('Failed to delete invoice', HttpStatus.CONFLICT);
    else
      return 'success';
  }

  @Put('invoices/:id')
  @UseGuards(JwtAuthGuard)
  async updateInvoiceContent(@Body() body, @Param('id', new ParseIntPipe()) id): Promise<any> {
    let result = await this.appService.updateInvoiceContent(body,id);
    if (result === 'error') 
      throw new HttpException('Failed to update invoice', HttpStatus.INTERNAL_SERVER_ERROR);
    else
      return 'success';
  }

  @Post('invoices')
  @UseGuards(JwtAuthGuard)
  async getInvoice(@Body() body): Promise<any> {
    return await this.appService.getInvoices(body);
  }


  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  async getInvoices(): Promise<any> {
    return await this.appService.invoices();
  }


  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadInvoice(@UploadedFile() file: Express.Multer.File, @Body('userEmail') userEmail : string): Promise<string>{
    try {
      const result = await this.appService.uploadInvoice(file, userEmail);
      if (result === 'error'){
        console.log('404')
        throw new HttpException('Failed to upload file', HttpStatus.BAD_REQUEST);
      } 
      
      return 'success';
    } catch (error) {
      //500
      
      console.log('500')
      console.log(error)
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers():Promise<any> {
    return await this.appService.getUsers();
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() body):Promise<string> {
    let result = await this.appService.createUser(body);

    if (result === 'error') 
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);

    if (result === 'fail') 
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);

      return 'success';

  }
}
