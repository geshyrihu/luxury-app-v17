import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CardEmployeeComponent from 'src/app/pages/directorios/employee-internal/card-employee.component';
import TicketMessageAddOrEditComponent from '../../messages/ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import { TicketMessageModule } from '../../ticket-message.module';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-report-work-plan',
  templateUrl: './ticket-message-report-work-plan.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketMessageModule],
})
export default class TicketMessageReportWorkPlanComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  ticketGroupService = inject(TicketGroupService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);

  data: any[] = [];
  originalData: any[] = [];

  assignee: string = null;
  cb_assignee: ISelectItem[] = [];
  status: number = this.ticketGroupService.ticketGroupMessageStatus;
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TicketWorkPlan/Pending/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.originalData = JSON.parse(JSON.stringify(result)); // Copia profunda
      const uniqueResponsibles = Array.from(
        new Map(
          this.originalData.map((item) => [item.assigneeId, item])
        ).values()
      );

      this.cb_assignee = uniqueResponsibles.map((item: any) => ({
        value: item.assigneeId,
        label: item.assignee,
      }));

      this.cb_assignee.push({
        value: null,
        label: 'Mostrar todos',
      });
    });
  }

  onResponsibleChange(event: any) {
    if (event.target.value === 'null') {
      // Mostrar todos los elementos
      this.data = [...this.originalData]; // Restaura todos
    } else {
      // Filtrar por el responsable seleccionado
      const result = this.originalData.filter(
        (resp: any) => resp.assigneeId == this.assignee
      );
      this.data = [...result]; // Crea una nueva referencia
    }
  }

  onPreviewClicked(): void {
    // Lógica para la vista previa
    this.router.navigate(['/tickets/work-plan-preview']);
  }
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageAddOrEditComponent,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        'Agregar',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerS.dialogSizeMd
    );
  }
}
