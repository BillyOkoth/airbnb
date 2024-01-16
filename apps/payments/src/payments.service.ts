import { CreateChargeDto, NOTIFICATION_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import  Stripe  from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-charge.dto';
@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    }
  )

  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly notificationsService:ClientProxy,
    private readonly logger:Logger,
    private readonly configService:ConfigService){}
   
  async createCharge({amount,email}:PaymentsCreateChargeDto){
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      confirm: true,
      payment_method_types: ['card'],
    });

   this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
   });
    return paymentIntent;
  }
}
