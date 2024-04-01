import { IItemsFondeoCaratula } from './items-fondeo-caratula.interface';

export interface IFondeoCaratula {
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
  itemsFondeoCaratulaDto: IItemsFondeoCaratula[];
  totalImporte: number;
  totalIva: number;
  totalTotales: number;
}
