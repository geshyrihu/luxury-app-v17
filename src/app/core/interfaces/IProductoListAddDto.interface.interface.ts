export interface IProductoListAddDto {
  id: number;
  customerId: number;
  productoId: number;
  nombreProducto: string;
  existencia: number;
  unidadDeMedidaId: number;
  stockMin: number;
  stockMax: number;
  employeeId: number;
}
