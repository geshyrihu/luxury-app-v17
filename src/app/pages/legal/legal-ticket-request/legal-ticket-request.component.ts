import { Component, OnInit, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomToastService } from 'src/app/core/services/common-services';
import TicketLegalProviderComponent from '../TicketLegalProvider/TicketLegalProvider.component';

@Component({
  selector: 'app-legal-ticket-request',
  templateUrl: './legal-ticket-request.component.html',
  standalone: true,
  imports: [],
})
export class LegalTicketRequestComponent implements OnInit {
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  onModalTicketLegalProvider() {
    this.ref = this.dialogService.open(TicketLegalProviderComponent, {
      data: {
        //  id: data.id,
      },
      header: 'Solicitud de alta de proveedor',
      styleClass: 'modal-lg ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    this.onCLoseModal();
  }

  onCLoseModal() {
    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
      }
    });
  }

  ngOnInit() {}
}
