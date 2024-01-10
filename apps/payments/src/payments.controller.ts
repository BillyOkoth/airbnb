import { Controller, UnprocessableEntityException } from '@nestjs/common';
import {MessagePattern ,Payload} from '@nestjs/microservices'
import { PaymentsService } from './payments.service';
import { CreateChargeDto } from '@app/common';
import { Logger } from 'nestjs-pino';
import { PaymentsCreateChargeDto } from './dto/payments-charge.dto';


@Controller()
export class PaymentsController {
  constructor(
    private readonly logger:Logger,
    private readonly paymentsService: PaymentsService) {}

 @MessagePattern('create-charge')
 async createCharge(@Payload() data: PaymentsCreateChargeDto){
  this.logger.fatal('CREATE_CHARGE',{data});
 

  try {
    const response =  await this.paymentsService.createCharge(data);
    return response;
  } catch (error) {
    throw new UnprocessableEntityException(error);
  }
 }
}
