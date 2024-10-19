import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditLedgerAccountsComponent from './addoredit-cuentas-tercer-nivel.component';

@Component({
  selector: 'app-list-cuentas-tercer-nivel',
  templateUrl: './list-cuentas-tercer-nivel.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListCuentasTercerNivelComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  state: boolean = true;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean) {
    this.apiRequestService
      .onGetList('Cuentas/GetList/' + (state ? 0 : 1))
      .then((result: any) => {
        this.data = result;
      });
  }

  onDelete(id: number) {
    this.apiRequestService.onDelete(`cuentas/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditLedgerAccountsComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.state);
      });
  }
}
