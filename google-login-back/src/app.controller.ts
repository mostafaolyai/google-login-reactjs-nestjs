import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './application/auth/decorator/meta-data/needs-permission';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Role(["USER"])
  getHello(): string {
    return this.appService.getHello();
  }
}
