import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/common-services';
import {
  DialogHandlerService,
  DialogSize,
} from 'src/app/core/services/dialog-handler.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { DataService } from '../../../core/services/data.service';
import { LegalTicketRequestComponent } from '../legal-ticket-request/legal-ticket-request.component';

@Component({
  selector: 'app-legal-list-ticket',
  templateUrl: './legal-list-ticket.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    CustomToastService,
    DialogHandlerService,
  ],
})
export default class LegalListTicketComponent implements OnInit {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogHandlerService = inject(DialogHandlerService);
  public dialogService = inject(DialogService);

  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {}

  onModalRequest(data: any) {
    this.dialogHandlerService
      .openDialog(LegalTicketRequestComponent, data, data.title, DialogSize.md)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
