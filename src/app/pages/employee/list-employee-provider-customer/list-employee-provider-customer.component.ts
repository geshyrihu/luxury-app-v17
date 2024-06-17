import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/core/interfaces/employee.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import CardEmployeeComponent from '../card-employee/card-employee.component';
import { EmployeeProviderAddOrEditComponent } from './employee-provider-add-or-edit/employee-provider-add-or-edit.component';
const base_urlImg = environment.base_urlImg + 'Administration/accounts/';

@Component({
  selector: 'app-list-employee-provider-customer',
  templateUrl: './list-employee-provider-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEmployeeProviderCustomerComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);

  activo: boolean = true;
  data: IEmployee[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  url = base_urlImg;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onSelectActive(active: boolean): any {
    this.activo = active;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ApplicationUserEmployee/Externo/List/${this.customerIdService.customerId}/${this.activo}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEdit() {
    this.dialogHandlerService
      .openDialog(
        EmployeeProviderAddOrEditComponent,
        {},
        'Agregar externo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDelete(itemId: number) {}

  onCardEmployee(applicationUserId: number) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      {
        applicationUserId,
      },
      'Colaborador',
      this.dialogHandlerService.dialogSizeSm
    );
  }
}
