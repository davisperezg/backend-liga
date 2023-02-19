import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from '../schemas/club.schema';

const CATEGORIAS = ['PRIMERA DIVISION', 'SEGUNDA DIVISION'];

@Injectable()
export class ClubService {
  constructor(
    @InjectModel(Club.name)
    private clubModel: Model<ClubDocument>,
  ) {}

  validarCateoria(categoria: string) {
    const existeLiga = CATEGORIAS.some(
      (a) => a.trim().toLowerCase() === categoria.trim().toLowerCase(),
    );

    if (!existeLiga) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'Categoria no pertece a nuestros registros.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async buscarClubXnombre(nombreRequest: string) {
    return await this.clubModel.findOne({
      nombre: nombreRequest.trim().toLowerCase(),
    });
  }

  async buscarClubXId(id: string) {
    return await this.clubModel.findById(id);
  }

  async buscarRepetido(nombre: string) {
    const obtenerClub = await this.buscarClubXnombre(nombre);
    if (obtenerClub) {
      const nombreClub = obtenerClub.nombre;

      if (nombreClub.trim().toLowerCase() === nombre.trim().toLowerCase()) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            type: 'BAD_REQUEST',
            message: 'No puede registrar un club que ya existe.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async validarCoincidenciaNombre(id: string, nombre: string) {
    /*
      Al actualizar verifcaremos que, al ingresar un nombre del club no debe coincidir con uno que ya existe en la db
    */
    const obtenerClub = await this.buscarClubXnombre(nombre);
    if (obtenerClub) {
      const nombreClub = obtenerClub.nombre;
      const obtenerClubAux = await this.buscarClubXId(id);
      const { _id: idAux } = obtenerClubAux;
      const { _id: idFind } = obtenerClub;

      if (
        String(idAux) !== String(idFind) &&
        nombreClub.trim().toLowerCase() === nombre.trim().toLowerCase()
      ) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            type: 'BAD_REQUEST',
            message: 'El nombre del club ingresado ya existe.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async create(createClub: Club, userToken?: any) {
    const { categoria, nombre } = createClub;

    //Validamos si la categoria es permitida
    this.validarCateoria(categoria);

    //Validamos si el club ya existe
    await this.buscarRepetido(nombre);

    return await new this.clubModel(createClub).save();
  }

  async update(id: string, updateClub: Club, userToken?: any) {
    const { categoria, nombre } = updateClub;

    //Validamos si la categoria es permitida
    this.validarCateoria(categoria);

    //Validamos si el club ya existe
    await this.validarCoincidenciaNombre(id, nombre);

    return await this.clubModel.findByIdAndUpdate(id, updateClub, {
      new: true,
    });
  }

  async findAll() {
    return await this.clubModel.find();
  }

  async findById(id: string) {
    return await this.clubModel.findById(id);
  }
}
