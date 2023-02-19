import { UseGuards } from '@nestjs/common/decorators';
import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import { Ticket } from '../schemas/ticket.scchema';
import { TicketService } from '../services/ticket.service';
import PermissionGuard from 'src/lib/guards/resources.guard';
import Permission from 'src/lib/type/permission.type';
import { isValidObjectId } from 'mongoose';

@Controller('api/v1/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // Add(POST): http://localhost:3000/api/v1/tickets
  @Post()
  @UseGuards(PermissionGuard(Permission.CreateTickets))
  async create(
    @Res() res,
    @Body() createBody: Ticket,
    @CtxUser() userToken: any,
  ): Promise<Ticket> {
    const seq = await this.ticketService.create(createBody, userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Ticket creada satisfactoriamente',
      success: true,
      seq,
    });
  }

  // Get All: http://localhost:3000/api/v1/tickets
  @Get()
  @UseGuards(PermissionGuard(Permission.ReadTickets))
  async getAll(@Res() res, @CtxUser() userToken: any) {
    const response = await this.ticketService.findAllTickets(userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Tickets obtenidos satisfactoriamente',
      success: true,
      response,
    });
  }

  // Get All: http://localhost:3000/api/v1/tickets/asdasdasdmasd
  @Get(':id')
  async getOne(@Res() res, @Param('id') id: string) {
    const response = await this.ticketService.findById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Ticket obtenido satisfactoriamente',
      success: true,
      response,
    });
  }

  // Get All: http://localhost:3000/api/v1/tickets/checking/asdasdasdmasd
  @Get('/checking/:id')
  async getChecking(@Res() res, @Param('id') id: string) {
    const response = await this.ticketService.findByIdChecking(id);
    return res.status(HttpStatus.OK).json(response);
  }
}
