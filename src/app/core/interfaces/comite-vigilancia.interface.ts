import { IListCondomino } from './list-condomino.interface';

export interface IComiteVigilancia {
  id: number;
  listCondominoId: number;
  listCondomino: IListCondomino;
  ePosicionComite: string;
}
