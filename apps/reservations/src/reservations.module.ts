import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule ,Transport} from '@nestjs/microservices';
import { DatabaseModule, LoggerModule, PAYMENTS_SERVICE,AUTH_SERVICE } from '@app/common';
import * as Joi from 'joi';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservations.schema';




@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema }
    ]),
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema:Joi.object({
        MONGODB_URI:Joi.string().required(),
        PORT:Joi.number().required(),
        PAYMENTS_HOST:Joi.string().required(),
        PAYMENTS_PORT:Joi.number().required()
      })
    }),
    ClientsModule.registerAsync([{
      name:AUTH_SERVICE, 
      useFactory: (configService:ConfigService)=>({
        transport:Transport.TCP,
        options:{
          host:configService.get('AUTH_HOST'),
          port:configService.get('AUTH_PORT')
        }
      }),
      inject:[ConfigService]
    }]),
    ClientsModule.registerAsync([
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      }
    ]),
    LoggerModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule { }
