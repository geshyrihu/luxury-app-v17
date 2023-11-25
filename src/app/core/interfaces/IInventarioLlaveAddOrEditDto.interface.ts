export interface IInventarioLlaveAddOrEditDto {
  id: number;
  customerId: number;
  descripcion: string;
  marca: string;
  numeroLlave: number;
  cantidad: number;
  equipoClasificacionId: number;
  applicationUserId: string;
}
