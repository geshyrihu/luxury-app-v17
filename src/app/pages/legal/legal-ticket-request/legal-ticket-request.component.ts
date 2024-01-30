import { Component, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomToastService } from 'src/app/core/services/common-services';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketLegalAssembliesComponent from '../TicketLegalAssemblies/TicketLegalAssemblies.component';
import TicketLegalCommitteeMeetingsLegalTopicsComponent from '../TicketLegalCommitteeMeetingsLegalTopics/TicketLegalCommitteeMeetingsLegalTopics.component';
import TicketLegalLatePayerAgreementsComponent from '../TicketLegalLatePayerAgreements/TicketLegalLatePayerAgreements.component';
import TicketLegalProviderComponent from '../TicketLegalProvider/TicketLegalProvider.component';
import TicketLegalProviderContractsRenewalsComponent from '../TicketLegalProviderContractsRenewals/TicketLegalProviderContractsRenewals.component';
import TicketLegalOtherComponent from '../ticket-legal-other/ticket-legal-other.component';

@Component({
  selector: 'app-legal-ticket-request',
  templateUrl: './legal-ticket-request.component.html',
  standalone: true,

  providers: [CustomToastService, DialogHandlerService],
})
export class LegalTicketRequestComponent {
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public dialogHandlerService = inject(DialogHandlerService);

  onModalTicketLegalProvider() {
    this.dialogHandlerService.openDialog(
      TicketLegalProviderComponent,
      null,
      'ALTA DE PROVEEDOR',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalProviderContractsRenewals() {
    this.dialogHandlerService.openDialog(
      TicketLegalProviderContractsRenewalsComponent,
      null,
      'RENOVACIÓN DE CONTRATO PROVEEDORES',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalAssembliesComponent() {
    this.dialogHandlerService.openDialog(
      TicketLegalAssembliesComponent,
      null,
      'ASAMBLEAS',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketTicketLegalCommitteeMeetingsLegalTopicsComponent() {
    this.dialogHandlerService.openDialog(
      TicketLegalCommitteeMeetingsLegalTopicsComponent,
      null,
      'JUNTAS DE COMITE',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalLatePayerAgreementsComponent() {
    this.dialogHandlerService.openDialog(
      TicketLegalLatePayerAgreementsComponent,
      null,
      'CONVENIO MOROSOS',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalOther() {
    this.dialogHandlerService.openDialog(
      TicketLegalOtherComponent,
      null,
      'OTROS',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
}
