import { Controller, HttpStatus } from '@nestjs/common';
import { PreciosService } from '../services/precios.service';
import {
  Body,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common/decorators';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import PermissionGuard from 'src/lib/guards/resources.guard';
import Permission from 'src/lib/type/permission.type';
import { Precio } from '../schemas/precio.schema';

@Controller('api/v1/precios')
export class PreciosController {
  constructor(private readonly precioService: PreciosService) {}

  // Add(POST): http://localhost:3000/api/v1/secuencias
  @Post()
  @UseGuards(PermissionGuard(Permission.CreatePrice))
  async create(
    @Res() res,
    @Body() createBody: Precio,
    @CtxUser() userToken: any,
  ): Promise<Precio> {
    const seq = await this.precioService.create(createBody, userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Precio creado satisfactoriamente',
      success: true,
      seq,
    });
  }

  // Update(PUT): http://localhost:3000/api/v1/secuencias/6223169df6066a084cef08c2
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.UpdatePrice))
  async update(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Precio,
    @CtxUser() userToken: any,
  ): Promise<Precio> {
    const seq = await this.precioService.update(id, createBody, userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Precio actualizado satisfactoriamente',
      success: true,
      seq,
    });
  }

  // Get All: http://localhost:3000/api/v1/secuencias
  @Get()
  @UseGuards(PermissionGuard(Permission.ReadPrice))
  async getAll(@Res() res, @CtxUser() userToken: any) {
    const response = await this.precioService.findAll(userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Precios obtenidos satisfactoriamente',
      success: true,
      response,
    });
  }

  // Get One: http://localhost:3000/api/v1/secuencias/6223169df6066a084cef08c2
  @Get(':id')
  @UseGuards(PermissionGuard(Permission.GetOnePrice))
  async getOne(@Res() res, @Param('id') id: string) {
    const response = await this.precioService.findById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Precio obtenido satisfactoriamente',
      success: true,
      response,
    });
  }
}
