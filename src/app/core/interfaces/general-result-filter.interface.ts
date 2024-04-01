import { IResultadoGeneralFiltroCustomer as IGeneralClientResultFilter } from './general-client-result-filter.interface';

export interface IGeneralResultFilter {
  customers: IGeneralClientResultFilter[];
  minutas: boolean;
  mantenimientosPreventivos: boolean;
  mantenimientosCorrectivos: boolean;
  fechaInicial: string;
  fechaFinal: string;
}
