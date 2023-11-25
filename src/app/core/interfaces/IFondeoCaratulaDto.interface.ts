import { IItemsFondeoCaratulaDto } from './IItemsFondeoCaratulaDto.interface';

export interface IFondeoCaratulaDto {
  nameCustomer: string;
  logoCustomer: string;
  logoGrupoLuxury: string;
  fechaInicial: string;
  fechaFinal: string;
  eTipoGasto: string;
  cuenta: string;
  datoDePago: string;
  entregadoPor: string;
  ligaFacturas: string;
  itemsFondeoCaratulaDto: IItemsFondeoCaratulaDto[];
  totalImporte: number;
  totalIva: number;
  totalTotales: number;
}
