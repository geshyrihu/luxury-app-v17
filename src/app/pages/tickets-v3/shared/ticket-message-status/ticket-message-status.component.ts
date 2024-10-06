import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ETicketMessageStatus } from '../../ticket-message-status.enum';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-status',
  templateUrl: './ticket-message-status.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TicketMessageStatusComponent {
  ticketGroupService = inject(TicketGroupService);

  cb_status: ISelectItem[] = onGetSelectItemFromEnum(ETicketMessageStatus); // Lista de estados
  status: string = this.ticketGroupService.ticketGroupMessageStatus; // Estado actual
  @Output() statusChange = new EventEmitter<string>(); // Evento para emitir el cambio de estado

  onStatusChange(value: any) {
    this.ticketGroupService.setStatus(value);
    this.status = value;
    this.statusChange.emit(this.status); // Emitir el nuevo estado
  }
}
