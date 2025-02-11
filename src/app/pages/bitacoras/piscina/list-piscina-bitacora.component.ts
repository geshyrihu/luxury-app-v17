import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditPiscinaBitacoraComponent from './addoredit-piscina-bitacora.component';

@Component({
    selector: 's-list-piscina-bitacora',
    templateUrl: './list-piscina-bitacora.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListPiscinaBitacoraComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  rutaActiva = inject(ActivatedRoute);

  data: any[] = [];
  ref: DynamicDialogRef;

  piscinaId: number = 0;
  ngOnInit(): void {
    this.piscinaId = this.rutaActiva.snapshot.params.piscinaId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = 'piscinabitacora/getall/' + this.piscinaId;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`piscinabitacora/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditPiscinaBitacoraComponent,
        {
          id: data.id,
          piscinaId: this.piscinaId,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
