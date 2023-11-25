export interface IItemsFondeoCaratulaDto {
  id: number;
  fecha: string;
  acreedor: string;
  factura: string;
  concepto: string;
  importe: number;
  iva: number;
  retencion: number;
  totales: number;
  banco: string;
  cuentaDeposito: string;
}
export type TableRowItemFondeoCaratulaDto = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];
