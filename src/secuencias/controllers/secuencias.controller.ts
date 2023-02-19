import { Controller, HttpStatus } from '@nestjs/common';
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
import { Secuencias } from '../schemas/secuencias.schema';
import { SecuenciasService } from '../services/secuencias.service';

@Controller('api/v1/secuencias')
export class SecuenciasController {
  constructor(private readonly secuenciaService: SecuenciasService) {}

  // Add(POST): http://localhost:3000/api/v1/secuencias
  @Post()
  @UseGuards(PermissionGuard(Permission.CreateSeq))
  async create(
    @Res() res,
    @Body() createBody: Secuencias,
    @CtxUser() userToken: any,
  ): Promise<Secuencias> {
    const seq = await this.secuenciaService.create(createBody, userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Secuencia creada satisfactoriamente',
      success: true,
      seq,
    });
  }

  // Update(PUT): http://localhost:3000/api/v1/secuencias/6223169df6066a084cef08c2
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.UpdateSeq))
  async update(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Secuencias,
    @CtxUser() userToken: any,
  ): Promise<Secuencias> {
    const seq = await this.secuenciaService.update(id, createBody, userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Secuencia actualizada satisfactoriamente',
      success: true,
      seq,
    });
  }

  // Get All: http://localhost:3000/api/v1/secuencias
  @Get()
  @UseGuards(PermissionGuard(Permission.ReadSeqs))
  async getAll(@Res() res, @CtxUser() userToken: any) {
    const response = await this.secuenciaService.findAll(userToken);
    return res.status(HttpStatus.OK).json({
      message: 'Secuencias obtenidas satisfactoriamente',
      success: true,
      response,
    });
  }

  // Get One: http://localhost:3000/api/v1/secuencias/6223169df6066a084cef08c2
  @Get(':id')
  @UseGuards(PermissionGuard(Permission.GetOneSeq))
  async getOne(@Res() res, @Param('id') id: string) {
    const response = await this.secuenciaService.buscarLigaXnombre(id);
    return res.status(HttpStatus.OK).json({
      message: 'Secuencia obtenida satisfactoriamente',
      success: true,
      response,
    });
  }
}
