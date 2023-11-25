export interface PiscinaBitacoraAddOrEditDto {
  id: number;
  piscinaId: number;
  date: string;
  hour: string;
  cl: number;
  ph: number;
  alkalinidad: number | null;
  dureza: number | null;
  temperatura: number;
  aplicationCl: number;
  aplicationPhMas: number;
  aplicationPhMenos: number;
  cepillado: boolean;
  aspirado: boolean;
  cenefas: boolean;
  employeeId: number;
}
