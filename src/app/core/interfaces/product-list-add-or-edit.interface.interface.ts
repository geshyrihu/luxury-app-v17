export interface IProductoListAdd {
  id: number;
  customerId: number;
  productoId: number;
  nombreProducto: string;
  existencia: number;
  unidadDeMedidaId: number;
  stockMin: number;
  stockMax: number;
  applicationUserId: string;
}
