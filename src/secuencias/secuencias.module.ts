import { Module } from '@nestjs/common';
import { SecuenciasService } from './services/secuencias.service';
import { SecuenciasController } from './controllers/secuencias.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Secuencias, SecuenciasSchema } from './schemas/secuencias.schema';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  providers: [SecuenciasService],
  controllers: [SecuenciasController],
  imports: [
    MongooseModule.forFeature([
      { name: Secuencias.name, schema: SecuenciasSchema },
    ]),
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: Secuencias.name,
    //     useFactory: async (connection: Connection) => {
    //       const schema = SecuenciasSchema;
    //       const AutoIncrement = AutoIncrementFactory(connection);
    //       schema.plugin(AutoIncrement, { inc_field: 'id' });
    //       return schema;
    //     },
    //     inject: [getConnectionToken()],
    //   },
    // ]),
  ],
})
export class SecuenciasModule {}
