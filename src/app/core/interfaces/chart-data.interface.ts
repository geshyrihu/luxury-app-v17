import { IDataSets } from './chart-data-set.interface';

export interface IChartData {
  labels: string[];
  dataSets: IDataSets[];
}
