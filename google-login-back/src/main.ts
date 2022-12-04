import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AuthService } from './application/auth/auth.service';
import { getJwtMiddleware } from './application/auth/middlewares/jwt-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.raw({ type: 'application/json' }));
  app.use(getJwtMiddleware(app.get(AuthService)));
  await app.listen(3000);
}
bootstrap();
