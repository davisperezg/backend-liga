import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
export type ClubDocument = Club & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Club {
  @Prop({ trim: true, requerid: true, uppercase: true })
  categoria: string;

  @Prop({ trim: true, requerid: true, uppercase: true })
  nombre: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
