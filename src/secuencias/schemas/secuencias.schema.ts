import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
export type SecuenciasDocument = Secuencias & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Secuencias {
  @Prop({ trim: true, requerid: true, uppercase: true })
  liga: string;

  @Prop({ trim: true, type: Number })
  secuencia: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const SecuenciasSchema = SchemaFactory.createForClass(Secuencias);
