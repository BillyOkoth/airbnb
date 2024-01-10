import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import  Stripe  from 'stripe';
@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    }
  )

  constructor(
    private readonly logger:Logger,
    private readonly configService:ConfigService){}
   
  async createCharge({amount}:CreateChargeDto){
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      confirm: true,
      payment_method_types: ['card'],
    });

   
    return paymentIntent;
  }
}
