import { Component, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomToastService } from 'src/app/core/services/common-services';
import {
  DialogHandlerService,
  DialogSize,
} from 'src/app/core/services/dialog-handler.service';
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
  imports: [],
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
      DialogSize.lg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalProviderContractsRenewals() {
    this.dialogHandlerService.openDialog(
      TicketLegalProviderContractsRenewalsComponent,
      null,
      'RENOVACIÓN DE CONTRATO PROVEEDORES',
      DialogSize.lg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalAssembliesComponent() {
    this.dialogHandlerService.openDialog(
      TicketLegalAssembliesComponent,
      null,
      'ASAMBLEAS',
      DialogSize.lg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketTicketLegalCommitteeMeetingsLegalTopicsComponent() {
    this.dialogHandlerService.openDialog(
      TicketLegalCommitteeMeetingsLegalTopicsComponent,
      null,
      'JUNTAS DE COMITE',
      DialogSize.lg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalLatePayerAgreementsComponent() {
    this.dialogHandlerService.openDialog(
      TicketLegalLatePayerAgreementsComponent,
      null,
      'CONVENIO MOROSOS',
      DialogSize.lg // Tamaño del cuadro de diálogo
    );
  }
  onModalTicketLegalOther() {
    this.dialogHandlerService.openDialog(
      TicketLegalOtherComponent,
      null,
      'OTROS',
      DialogSize.lg // Tamaño del cuadro de diálogo
    );
  }
}
