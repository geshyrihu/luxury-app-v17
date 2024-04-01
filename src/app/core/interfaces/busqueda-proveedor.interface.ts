import { IBusquedaCategoria } from './busqueda-categoria.interface';

export interface IBusquedaProveedor {
  providerId: number;
  nameProvider: string;
  nameComercial: string;
  pathPhoto: string;
  activo: boolean;
  user: string;
  categorias: IBusquedaCategoria[];
}
