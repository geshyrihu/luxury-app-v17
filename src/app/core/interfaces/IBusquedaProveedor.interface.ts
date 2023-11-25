import { IBusquedaCategoria } from './IBusquedaCategoria.interface';

export interface BusquedaProveedor {
  providerId: number;
  nameProvider: string;
  nameComercial: string;
  pathPhoto: string;
  activo: boolean;
  user: string;
  categorias: IBusquedaCategoria[];
}
