// calendar.model.ts
export interface Calendar {
  id?: string;
  name: string;
  description: string;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  location?: string;
  isRecurring: boolean;
  recurringPattern?: string;
}
