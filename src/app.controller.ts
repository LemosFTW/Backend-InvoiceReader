import { Controller, Get,UploadedFile, Post,UseInterceptors,HttpException, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('upload')
  getHello(): string {
    return 'Hello World!';
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadInvoice(@UploadedFile() file: Express.Multer.File): Promise<string>{
    try {
      console.log(file);
      const result = await this.appService.uploadInvoice(file);
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
