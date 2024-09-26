export interface LuxuryChatMessage {
  id: string;
  luxuryChatGroupId: string;
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
  luxuryChatMessageFollowUp: number;
  luxuryChatGroupMessageRead: number;
}

export interface LuxuryChatResult {
  nameChat: string;
  items: LuxuryChatMessage[];
}
