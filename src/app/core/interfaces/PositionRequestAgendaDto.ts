import { PositionRequestAgendaItemsDto } from './PositionRequestAgendaItemsDto';

export interface PositionRequestAgendaDto {
  positionRequestFolio: number;
  customerName: string;
  professionName: string;
  candidates: PositionRequestAgendaItemsDto[];
}
