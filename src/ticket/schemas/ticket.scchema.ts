import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Precio } from 'src/precios/schemas/precio.schema';
import { User } from 'src/user/schemas/user.schema';
import { DetailTicket } from './detail.schema';
export type TicketDocument = Ticket & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Ticket {
  @Prop({ trim: true, requerid: true, uppercase: true })
  liga: string;

  @Prop({ trim: true, requerid: true, uppercase: true })
  tipoTicket: string;

  @Prop({ requerid: true, type: Number })
  nroTicket: number;

  @Prop({
    requerid: true,
    type: [
      {
        nroTicket: { type: Number },
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Precio',
        },
        cantidad: { type: Number },
        precio: { type: Number },
      },
    ],
  })
  details: {
    nroTicket: number;
    producto: Precio;
    cantidad: number;
    precio: number;
  }[];

  @Prop({ requerid: true, type: Number })
  pagoCon: number;

  @Prop({ trim: true, requerid: true, uppercase: true })
  metodo: string;

  @Prop({ trim: true, requerid: true })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: User;

  @Prop({ requerid: true, type: Number })
  checking: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
