import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
export type PrecioDocument = Precio & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Precio {
  @Prop({ trim: true, requerid: true, uppercase: true })
  liga: string;

  @Prop({ trim: true, requerid: true, uppercase: true })
  usuario: string;

  @Prop({ trim: true, type: Number })
  costo: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const PrecioSchema = SchemaFactory.createForClass(Precio);
