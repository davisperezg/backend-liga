import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Precio, PrecioDocument } from '../schemas/precio.schema';

const LIGAS = ['SANTA MARIA'];

@Injectable()
export class PreciosService {
  constructor(
    @InjectModel(Precio.name)
    private precioModel: Model<PrecioDocument>,
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
    return await this.precioModel.findOne({
      liga: ligaRequest.trim().toLowerCase(),
    });
  }

  async buscarLigaXusuario(usuarioRequest: string) {
    return await this.precioModel.findOne({
      usuario: usuarioRequest.trim().toLowerCase(),
    });
  }

  async buscarLigaRepetida(liga: string, usuario: string) {
    //Consultamos liga x nombre
    const obtenerLiga = await this.buscarLigaXnombre(liga);

    if (obtenerLiga) {
      //No se puede ingresar una liga que ya existe en la db
      const ligaRegistrada = obtenerLiga.liga;

      //buscar usuario
      const obtenerUsuario = await this.buscarLigaXusuario(usuario);

      if (obtenerUsuario) {
        const usuarioRegistrado = obtenerUsuario.usuario;

        if (
          ligaRegistrada.trim().toLowerCase() === liga.trim().toLowerCase() &&
          usuarioRegistrado.trim().toLowerCase() ===
            usuario.trim().toLowerCase()
        ) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              type: 'BAD_REQUEST',
              message: 'No puede registrar un precio que ya existe.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  /*Al actualizar verifcaremos que, al ingresar un nombre del club no debe coincidir con uno que ya existe en la db*/
  async validarCoincidenciaLiga(id: string, liga: string, usuario: string) {
    //Consultamos liga x nombre
    const obtenerLiga = await this.buscarLigaXnombre(liga);

    if (obtenerLiga) {
      //No se puede ingresar una liga que ya existe en la db
      const ligaRegistrada = obtenerLiga.liga;

      //buscar usuario
      const obtenerUsuario = await this.buscarLigaXusuario(usuario);

      if (obtenerUsuario) {
        const usuarioRegistrado = obtenerUsuario.usuario;
        const obtenerLigaAux = await this.findById(id);
        const { _id: idAux } = obtenerLigaAux;
        const { _id: idFind } = obtenerLiga;

        if (
          String(idAux) !== String(idFind) &&
          ligaRegistrada.trim().toLowerCase() === liga.trim().toLowerCase() &&
          usuarioRegistrado.trim().toLowerCase() ===
            usuario.trim().toLowerCase()
        ) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              type: 'BAD_REQUEST',
              message: 'No puede registrar un precio que ya existe.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  async update(id: string, updatePrecio: Precio, userToken: any) {
    //datos del token
    const { findUser } = userToken;

    //Request body
    const { liga, usuario } = updatePrecio;

    //Verificar si. La liga que se ingresa corresponde a nuestro const
    this.validarLiga(liga);

    //Verificar que, la liga no debe coincidir con una de la db
    await this.validarCoincidenciaLiga(id, liga, usuario);

    //Si pasa Precio mandamos data
    const data: Precio = {
      ...updatePrecio,
      updatedBy: findUser._id,
    };

    return await this.precioModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async create(createPrecio: Precio, userToken: any) {
    //Datos del token
    const { findUser } = userToken;

    //Request body
    const { liga, usuario } = createPrecio;

    //Verificar si. La liga que se ingresa corresponde a nuestro const
    this.validarLiga(liga);

    //Verificamos si. La liga y usuario(PADRE) ya existe en nuestra db
    await this.buscarLigaRepetida(liga, usuario);

    //Si pasa las verificaciones. Mandamos data
    const data: Precio = {
      ...createPrecio,
      createdBy: findUser._id,
    };

    return await new this.precioModel(data).save();
  }

  async findAll(userToken: any) {
    const { findUser } = userToken;

    if (findUser.role === 'OWNER') {
      return await this.precioModel.find();
    }

    return await this.precioModel.find({
      liga: findUser.liga,
    });
  }

  async findById(id: string) {
    return await this.precioModel.findById(id);
  }
}
