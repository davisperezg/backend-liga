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
import PermissionGuard from 'src/lib/guards/resources.guard';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import Permission from 'src/lib/type/permission.type';
import { ClubService } from '../services/club.service';
import { Club } from '../schemas/club.schema';

@Controller('api/v1/club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  // Add(POST): http://localhost:3000/api/v1/club
  @Post()
  //@UseGuards(PermissionGuard(Permission.CreateSeq))
  async create(
    @Res() res,
    @Body() createBody: Club,
    // @CtxUser() userToken: any,
  ): Promise<Club> {
    const club = await this.clubService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Club creado satisfactoriamente',
      success: true,
      club,
    });
  }

  // Update(PUT): http://localhost:3000/api/v1/club/6223169df6066a084cef08c2
  @Put(':id')
  // @UseGuards(PermissionGuard(Permission.UpdateSeq))
  async update(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Club,
    //@CtxUser() userToken: any,
  ): Promise<Club> {
    const seq = await this.clubService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Club actualizado satisfactoriamente',
      success: true,
      seq,
    });
  }

  // Get All: http://localhost:3000/api/v1/club
  @Get()
  //@UseGuards(PermissionGuard(Permission.ReadSeqs))
  async getAll(@Res() res) {
    const response = await this.clubService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Clubs obtenidos satisfactoriamente',
      success: true,
      response,
    });
  }

  // Get One: http://localhost:3000/api/v1/club/6223169df6066a084cef08c2
  @Get(':id')
  //@UseGuards(PermissionGuard(Permission.GetOneSeq))
  async getOne(@Res() res, @Param('id') id: string) {
    const response = await this.clubService.findById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Club obtenido satisfactoriamente',
      success: true,
      response,
    });
  }
}
