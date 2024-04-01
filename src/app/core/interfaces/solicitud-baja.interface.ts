import { IDiscountDescription } from './discount-description.interface';

export interface ISolicitudBaja {
  profession: number;
  executionDate: string;
  employee: number;
  phoneEmployee: string;
  typeOfDeparture: string;
  reasonForLeaving: string;
  discountDescription: IDiscountDescription[];
  supportFiles: File[];
  lawyerAssistance: boolean;
  employeeInformed: boolean;
}
