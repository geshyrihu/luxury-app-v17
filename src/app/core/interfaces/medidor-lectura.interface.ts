import { IMedidor } from './medidor.interface';

export interface IMedidorLectura {
  id: number;
  medidorId: number;
  medidor: IMedidor;
  fechaRegistro?: string;
  lectura: number;
  applicationUserId: string;
}
