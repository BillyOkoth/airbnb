import { NestFactory } from '@nestjs/core';
import {Transport} from '@nestjs/microservices'
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport:Transport.TCP,
    options:{
      host:'0.0.0.0',
      port:configService.get<number>('PORT')
    }
  })
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();