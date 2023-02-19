import { Test, TestingModule } from '@nestjs/testing';
import { SecuenciasController } from './secuencias.controller';

describe('SecuenciasController', () => {
  let controller: SecuenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecuenciasController],
    }).compile();

    controller = module.get<SecuenciasController>(SecuenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
