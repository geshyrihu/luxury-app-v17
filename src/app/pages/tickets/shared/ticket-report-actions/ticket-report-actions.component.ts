import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "app-ticket-report-actions",
    templateUrl: "./ticket-report-actions.component.html",
    imports: []
})
export default class TicketReportActionsComponent {
  @Output() previewClicked = new EventEmitter<void>();
  @Output() sendReportClicked = new EventEmitter<void>();

  onPreview(): void {
    this.previewClicked.emit();
  }

  onSendReport(): void {
    this.sendReportClicked.emit();
  }
}
