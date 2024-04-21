import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EPriority } from 'src/app/core/enums/priority.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IFilterTicket } from 'src/app/core/interfaces/filter-ticket.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { DataService } from '../../../../core/services/data.service';
@Component({
  selector: 'app-ticket-filter',
  templateUrl: './ticket-filter.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FilterTicketComponent implements OnInit {
  private filterReportOperation = inject(TicketFilterService);
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  apiRequestService = inject(ApiRequestService);

  filterTicket: IFilterTicket;
  cb_status: ISelectItem[] = onGetSelectItemFromEnum(EStatusTask);
  cb_priority: ISelectItem[] = onGetSelectItemFromEnum(EPriority);
  cb_area_responsable: ISelectItem[] = [];
  cb_customer: ISelectItem[] = [];
  cb_solicitantes: ISelectItem[] = [];
  messageError: string = '';

  form: FormGroup;

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.onLoadForm();
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      customer: [this.filterReportOperation.filterTicket.customer],
      status: [this.filterReportOperation.filterTicket.status],
      responsible: [this.filterReportOperation.filterTicket.responsible],
      request: [this.filterReportOperation.filterTicket.request],
      requestStart: [this.filterReportOperation.filterTicket.requestStart],
      finishedStart: [this.filterReportOperation.filterTicket.finishedStart],
      requestEnd: [this.filterReportOperation.filterTicket.requestEnd],
      finishedEnd: [this.filterReportOperation.filterTicket.finishedEnd],
      priority: [this.filterReportOperation.filterTicket.priority],
      folioReporte: [this.filterReportOperation.filterTicket.folioReporte],
    });
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`ResponsibleArea`)
      .then((response: any) => {
        this.cb_area_responsable = response;
      });

    this.apiRequestService
      .onGetSelectItem(`customers`)
      .then((response: any) => {
        this.cb_customer = response;
      });
    this.dataService
      .post(
        'SelectItem/EmpleadosSolicitudTicket',
        this.filterReportOperation.getfilterTicket
      )
      .subscribe((response: any) => {
        this.cb_solicitantes = response.body;
      });
  }
  onResetForm() {
    this.form.reset();
  }
  onSubmit() {
    if (
      this.form.get('folioReporte').value === null &&
      this.form.get('finishedEnd').value === null &&
      this.form.get('finishedStart').value === null &&
      this.form.get('priority').value === null &&
      this.form.get('request').value === null &&
      this.form.get('requestEnd').value === null &&
      this.form.get('requestStart').value === null &&
      this.form.get('responsible').value === null &&
      this.form.get('status').value === null &&
      this.form.get('folioReporte').value === null
    ) {
      this.messageError = 'Seleccione al menos una opcion para filtrar';
      return;
    }

    this.form.patchValue({
      customer: this.filterReportOperation.filterTicket.customer,
    });
    this.filterReportOperation.setfilterTicket(this.form.value);
    this.ref.close(true);
  }
}
