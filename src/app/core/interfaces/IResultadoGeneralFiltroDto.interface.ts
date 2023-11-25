import { IResultadoGeneralFiltroCustomerDto } from './IResultadoGeneralFiltroCustomerDto.interface';

export interface IResultadoGeneralFiltroDto {
  customers: IResultadoGeneralFiltroCustomerDto[];
  minutas: boolean;
  mantenimientosPreventivos: boolean;
  mantenimientosCorrectivos: boolean;
  fechaInicial: string;
  fechaFinal: string;
}
