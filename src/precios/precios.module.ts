import { Module } from '@nestjs/common';
import { PreciosService } from './services/precios.service';
import { PreciosController } from './controllers/precios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Precio, PrecioSchema } from './schemas/precio.schema';

@Module({
  providers: [PreciosService],
  controllers: [PreciosController],
  imports: [
    MongooseModule.forFeature([{ name: Precio.name, schema: PrecioSchema }]),
  ],
})
export class PreciosModule {}
