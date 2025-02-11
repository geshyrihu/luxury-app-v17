import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';

export interface TicketMessage {
  id: string;
  ticketGroupId: string;
  folio: string;
  title: string;
  meetingId: string | null;
  serviceOrderId: string | null;
  createdAtDate: string;
  createdAtHour: string;
  createdAtFilter: Date;
  closedAt: string | null;
  closedAtFilter: boolean;
  scheduledAt: string | null;
  scheduledAtFilter: boolean;
  description: string;
  priority: string;
  status: string;
  isRelevant: boolean;
  creator: string | null;
  creatorId: string | null;
  creatorImg: string | null;
  assignee: string | null;
  assigneeId: string | null;
  assigneeImg: string | null;
  closedBy: string | null;
  afterWork: string | null;
  beforeWork: string | null;
  ticketMessageFollowUp: number;
  ticketGroupMessageRead: number;
}

export interface TicketResult {
  nameGroup: string;
  totalRecords: number;
  assignee: ISelectItem[];
  items: TicketMessage[];
}
