import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';

//.env config
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizerBase } from './application/auth/guards/abstract/authorizer-base';
import { JwtAuthGuard } from './application/auth/guards/jwt-auth.guard';
import { MainAuthorizer } from './application/auth/guards/main-authorizer';
dotenv.config();
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService,
    // make sure all APIs are only accessed by logged-in users
    // unless you specify otherwise, with {@link Public} decorator
    {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
    },
    // Application authorizer
    {
        provide: AuthorizerBase,
        useClass: MainAuthorizer,
    },],
})
export class AppModule {}
