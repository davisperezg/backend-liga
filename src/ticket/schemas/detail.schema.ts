import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Precio } from 'src/precios/schemas/precio.schema';
export type DetailTicketDocument = DetailTicket & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class DetailTicket {
  @Prop({ requerid: true, type: Number })
  nroTicket: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Precio',
    required: true,
  })
  producto: Precio;

  @Prop({ requerid: true, type: Number })
  cantidad: number;
}

export const DetailTicketSchema = SchemaFactory.createForClass(DetailTicket);
