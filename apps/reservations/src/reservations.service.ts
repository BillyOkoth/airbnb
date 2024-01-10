import { Inject, Injectable } from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { map, tap } from 'rxjs';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly logger:Logger,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService:ClientProxy, 
    private readonly reservationsRepository: ReservationsRepository) {}
  create(createReservationDto: CreateReservationDto) {
    return this.paymentsService.send('create-charge', {
      ...createReservationDto.charge,
    })
    .pipe(
      tap((res)=> this.logger.fatal('reservations created', {res})),
      map((res) => {
          return this.reservationsRepository.create({
        ...createReservationDto,
        invoiceId:res.id,
        timeStamp: new Date(),
        userId:'658eb8f025a9127e01959c71'
      });

      }),
      


    );
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id});
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({_id }, {$set :updateReservationDto});
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({_id});
  }
}
