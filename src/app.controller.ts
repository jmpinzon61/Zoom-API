import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serveSpa(@Res() res: Response) {
    res.sendFile('C:\\Users\\allan\\Desktop\\app-prueba\\zoom-dashboard\\build\\index.html');
  }
}
