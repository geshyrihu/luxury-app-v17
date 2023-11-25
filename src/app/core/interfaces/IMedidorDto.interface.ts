export interface IMedidorDto {
  id: number;
  customerId: number;
  medidorCategoria: {
    id: number;
    nombreMedidorCategoria: string;
  };
  medidorActivo: boolean;
  fechaRegistro: string;
  numeroMedidor: string;
  descripcion: string;
  consumoDiarioMaximo: number;
}
