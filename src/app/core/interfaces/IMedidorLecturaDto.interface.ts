import { IMedidorDto } from './IMedidorDto.interface';

export interface IMedidorLecturaDto {
  id: number;
  medidorId: number;
  medidor: IMedidorDto;
  fechaRegistro?: string;
  lectura: number;
  applicationUserId: string;
}
