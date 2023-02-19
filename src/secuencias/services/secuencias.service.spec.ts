import { Test, TestingModule } from '@nestjs/testing';
import { SecuenciasService } from './secuencias.service';

describe('SecuenciasService', () => {
  let service: SecuenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecuenciasService],
    }).compile();

    service = module.get<SecuenciasService>(SecuenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
