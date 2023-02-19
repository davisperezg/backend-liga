import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import {
  Secuencias,
  SecuenciasSchema,
} from 'src/secuencias/schemas/secuencias.schema';
import { TicketController } from './controllers/ticket.controller';
import { Ticket, TicketSchema } from './schemas/ticket.scchema';
import { TicketService } from './services/ticket.service';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';
import { SecuenciasService } from 'src/secuencias/services/secuencias.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService, SecuenciasService],
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Secuencias.name, schema: SecuenciasSchema },
    ]),
  ],
})
export class TicketModule {}
