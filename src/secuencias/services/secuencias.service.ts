import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Secuencias, SecuenciasDocument } from '../schemas/secuencias.schema';

const LIGAS = ['SANTA MARIA'];

@Injectable()
export class SecuenciasService {
  constructor(
    @InjectModel(Secuencias.name)
    private secuenciaModel: Model<SecuenciasDocument>,
  ) {}

  validarLiga(ligaRequest: string) {
    const existeLiga = LIGAS.some(
      (a) => a.trim().toLowerCase() === ligaRequest.trim().toLowerCase(),
    );

    if (!existeLiga) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'Liga no pertece a nuestros registros.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async buscarLigaXnombre(ligaRequest: string) {
    return await this.secuenciaModel.findOne({
      liga: ligaRequest.trim().toLowerCase(),
    });
  }

  async buscarLigaXId(id: string) {
    return await this.secuenciaModel.findById(id);
  }

  async buscarLigaRepetida(liga: string) {
    //Consultamos liga x nombre
    const obtenerLiga = await this.buscarLigaXnombre(liga);

    if (obtenerLiga) {
      //No se puede ingresar una liga que ya existe en la db
      const ligaRegistrada = obtenerLiga.liga;

      if (ligaRegistrada.trim().toLowerCase() === liga.trim().toLowerCase()) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            type: 'BAD_REQUEST',
            message: 'No puede registrar una liga que ya existe.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  /*Al actualizar verifcaremos que, al ingresar un nombre del club no debe coincidir con uno que ya existe en la db*/
  async validarCoincidenciaLiga(id: string, liga: string) {
    //Consultamos liga x nombre
    const obtenerLiga = await this.buscarLigaXnombre(liga);

    if (obtenerLiga) {
      //No se puede ingresar una liga que ya existe en la db
      const ligaRegistrada = obtenerLiga.liga;
      const obtenerLigaAux = await this.buscarLigaXId(id);
      const { _id: idAux } = obtenerLigaAux;
      const { _id: idFind } = obtenerLiga;

      if (
        String(idAux) !== String(idFind) &&
        ligaRegistrada.trim().toLowerCase() === liga.trim().toLowerCase()
      ) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            type: 'BAD_REQUEST',
            message: 'No puede registrar una liga que ya existe.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async verificarDisminucionSecuencia(liga: string, secuenciaRequest: number) {
    //Consultamos liga x nombre
    const obtenerLiga = await this.buscarLigaXnombre(liga);

    if (obtenerLiga) {
      //La secuencia ingresada no puede ser menor a la db
      const secuenciActual = obtenerLiga.secuencia;

      if (secuenciaRequest < secuenciActual) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            type: 'BAD_REQUEST',
            message: 'La secuencia ingresada es menor a la actual.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async update(id: string, updateSecuencia: Secuencias, userToken: any) {
    //datos del token
    const { findUser } = userToken;

    //Request body
    const { liga, secuencia: secuenciaRequest } = updateSecuencia;

    //Verificar si. La liga que se ingresa corresponde a nuestro const
    this.validarLiga(liga);

    //Verificar si. La secuencia ingresada es menor a la actual(db)
    await this.verificarDisminucionSecuencia(liga, secuenciaRequest);

    //Verificar que, la liga no debe coincidir con una de la db
    await this.validarCoincidenciaLiga(id, liga);

    //Si pasa verificaciones mandamos data
    const data: Secuencias = {
      ...updateSecuencia,
      updatedBy: findUser._id,
    };

    return await this.secuenciaModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async create(createSecuencia: Secuencias, userToken: any) {
    //Datos del token
    const { findUser } = userToken;

    //Request body
    const { liga } = createSecuencia;

    //Verificar si. La liga que se ingresa corresponde a nuestro const
    this.validarLiga(liga);

    //Verificamos si. La liga ya existe en nuestra db
    await this.buscarLigaRepetida(liga);

    //Si pasa las verificaciones. Mandamos data
    const data: Secuencias = {
      ...createSecuencia,
      createdBy: findUser._id,
    };

    return await new this.secuenciaModel(data).save();
  }

  async findAll(userToken: any) {
    const { findUser } = userToken;

    if (findUser.role === 'OWNER') {
      return await this.secuenciaModel.find();
    }

    return await this.secuenciaModel.find({
      liga: findUser.liga,
    });
  }

  async findById(id: string) {
    return await this.secuenciaModel.findById(id);
  }

  async sumSecuencia(id: string, insertSecuencia: number) {
    return await this.secuenciaModel.findByIdAndUpdate(
      id,
      {
        secuencia: insertSecuencia + 1,
      },
      { new: true },
    );
  }
}
