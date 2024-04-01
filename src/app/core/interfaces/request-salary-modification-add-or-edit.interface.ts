export interface IRequestSalaryModificationAddOrEdit {
  employeeId: number;
  workPositionId: number;
  requestDate: string;
  soport: string;
  professionCurrentId: number;
  professionNewId: number;
  currentSalary: number;
  finalSalary: number;
  executionDate: string;
  folio: string;
  retroactive: boolean;
  status: string;
  applicationUserId: string;
  confirmationFinish: boolean;
}
