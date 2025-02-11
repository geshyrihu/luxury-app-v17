import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { TicketGroupService } from '../../../tickets/ticket.service';

@Component({
    selector: 'app-ticket-message-status',
    templateUrl: './ticket-message-status.component.html',
    imports: [CommonModule, FormsModule],
    providers: [EnumSelectService]
})
export default class TicketMessageStatusComponent implements OnInit {
  ticketGroupService = inject(TicketGroupService);
  apiRequestS = inject(ApiRequestService);
  enumSelectS = inject(EnumSelectService);

  cb_status: ISelectItem[] = []; // Lista de estados

  status: string = this.ticketGroupService.ticketGroupMessageStatus; // Estado actual
  @Output() statusChange = new EventEmitter<string>(); // Evento para emitir el cambio de estado

  async ngOnInit() {
    this.cb_status = await this.enumSelectS.typeTicketMessageStatus(false);
  }

  onStatusChange(value: any) {
    this.ticketGroupService.setStatus(value);
    this.status = value;
    this.statusChange.emit(this.status); // Emitir el nuevo estado
  }
}
