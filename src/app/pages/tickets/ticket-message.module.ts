import { NgModule } from '@angular/core';

import TicketCloseButtonComponent from './shared/ticket-close-button/ticket-close-button.component';
import TicketDateRangeSelectorComponent from './shared/ticket-date-range-selector/ticket-date-range-selector.component';
import TicketFollowUpButtonComponent from './shared/ticket-follow-up-button/ticket-follow-up-button.component';
import TicketMessageStatusComponent from './shared/ticket-message-status/ticket-message-status.component';
import TicketProgramButtonComponent from './shared/ticket-program-button/ticket-program-button.component';
import TicketProgressButtonComponent from './shared/ticket-progress-button/ticket-progress-button.component';
import TicketReopenButtonComponent from './shared/ticket-reopen-button/ticket-reopen-button.component';
import TicketReportActionsComponent from './shared/ticket-report-actions/ticket-report-actions.component';

@NgModule({
  imports: [
    TicketMessageStatusComponent,
    TicketDateRangeSelectorComponent,
    TicketFollowUpButtonComponent,
    TicketProgramButtonComponent,
    TicketCloseButtonComponent,
    TicketProgressButtonComponent,
    TicketReportActionsComponent,
    TicketReopenButtonComponent,
  ],
  exports: [
    TicketMessageStatusComponent,
    TicketDateRangeSelectorComponent,
    TicketFollowUpButtonComponent,
    TicketProgramButtonComponent,
    TicketCloseButtonComponent,
    TicketProgressButtonComponent,
    TicketReportActionsComponent,
    TicketReopenButtonComponent,
  ],
})
export class TicketMessageModule {}
