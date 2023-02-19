import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecuenciasService } from 'src/secuencias/services/secuencias.service';
import { Ticket, TicketDocument } from '../schemas/ticket.scchema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<TicketDocument>,
    private readonly secuenciaService: SecuenciasService,
  ) {}

  async create(createTicket: Ticket, userToken: any) {
    //Datos del token
    const { findUser } = userToken;

    //Request body
    const { nroTicket, details, pagoCon } = createTicket;

    const obtenerSecuencia = await this.secuenciaService.buscarLigaXnombre(
      findUser.liga,
    );

    //Si no encuentra liga del usuario
    if (!obtenerSecuencia) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message:
            'El ticket no encuentra una liga a la cual pertenece el usuario.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //Si existe la secuencia x liga y no existe nroTicket manda error
    //Si existe la secuencia x liga y el nro de ticket ingresado es menor a la secuencia de la liga manda error
    if (
      (obtenerSecuencia && !nroTicket) ||
      (obtenerSecuencia &&
        obtenerSecuencia.liga === findUser.liga &&
        nroTicket < obtenerSecuencia.secuencia) ||
      (obtenerSecuencia &&
        obtenerSecuencia.liga === findUser.liga &&
        nroTicket > obtenerSecuencia.secuencia)
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'Error al enviar el nro de secuencia del ticket.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //Si no ingresa el campo detail o no manda nada esto mandara error
    if (!details || details.length <= 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'El ticket no tiene productos y no puede ser registrado.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //Validamos si el monto total ingresado es correcto
    const validTotalProducto = details.reduce(
      (acc, curr) => acc + curr.precio * curr.cantidad,
      0,
    );

    if (pagoCon < validTotalProducto) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'El usuario debe pagar igual o superior al monto total.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //Obtener secuencia para colocar al ticket
    const { _id, secuencia: insertSecuencia } = obtenerSecuencia;

    //const validarProductos = await this. REVISAR COD PRODS

    //Si pasa las verificaciones. Mandamos data
    const data: Ticket = {
      ...createTicket,
      nroTicket: insertSecuencia,
      metodo:
        validTotalProducto === pagoCon
          ? 'EFECTIVO COMPLETO'
          : 'EFECTIVO CON VUELTO',
      liga: findUser.liga,
      tipoTicket: 'VENTA',
      status: true,
      createdBy: findUser._id,
      checking: 1, //1 NO PASADO //2 YA PASADO
    };

    //Guardamos ticket
    const result = await new this.ticketModel(data).save();

    //Actualizamos secuencia de ticket +1
    await this.secuenciaService.sumSecuencia(_id, insertSecuencia);

    return result;
  }

  async findById(id: string) {
    const getTicket: any = await this.ticketModel
      .findOne({
        nroTicket: Number(id),
      })
      .populate([
        {
          path: 'createdBy',
        },
        {
          path: 'details',
          populate: 'producto',
        },
      ]);

    const result = {
      ...getTicket._doc,
      details: getTicket._doc.details.map((a) => {
        return {
          producto: a.producto.usuario,
          cantidad: a.cantidad,
          precio: a.precio,
        };
      }),
      createdBy: getTicket.createdBy.name + ' ' + getTicket.createdBy.lastname,
    };

    return result;
  }

  async findAllTickets(userToken: any) {
    const { findUser } = userToken;

    return await this.ticketModel.find({
      liga: findUser.liga,
    });
  }
}
