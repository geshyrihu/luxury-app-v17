export interface RequestModificacionSalarioDto {
  id: number;
  employeeId: number;
  requestDate: string;
  soport: any;
  professionId: number;
  currentSalary: number;
  finalSalary: number;
  executionDate: string;
  folio: string;
  retroactive: boolean;
}
