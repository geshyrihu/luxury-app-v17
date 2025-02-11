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
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  state: boolean = true;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean) {
    this.apiRequestS
      .onGetList('Cuentas/GetList/' + (state ? 0 : 1))
      .then((responseData: any) => {
        this.data = responseData;
      });
  }

  onDelete(id: number) {
    this.apiRequestS.onDelete(`cuentas/${id}`).then((responseData: boolean) => {
      if (responseData) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditLedgerAccountsComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.state);
      });
  }
}
