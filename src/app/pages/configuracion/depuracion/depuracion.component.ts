import { Component, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonModule],
  standalone: true,
})
export default class DepuracionComponent {
  apiRequestService = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  UpdateStateAppUserEmployee(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  MigrateDataToCustomerDataCompany(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }

  MigrateEmailPersonToApplicationUser(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  CreateApplicationUserDesdePerson(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  VerificarPersonasNoMigradas(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateApplicationIdInEntities(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  OnUpdateWeeklyReport(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UltimasrelacionUserIdPersonId(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  RemoveTicket(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateControlPrestamoHerramienta(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateTypePerson(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }

  UpdateAddress(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateAgendaSupervision(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateBitacoraMantenimiento(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateCatalogoGastosFijos(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateCedulaPresupuestalDetalle(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateDirectoryCondominium(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateEmployee(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateEntradaProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateEntregaRecepcionDescripcion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateEstadoFinanciero(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateHistorialAcceso(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateInventarioExtintor(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateInventarioIluminacion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateInventarioLlave(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateInventarioPintura(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateInventarioProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateListCondomino(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMachinery(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMaintenanceCalendar(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMedidorLectura(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMeeting(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMeetingAdministracion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMeetingComite(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMeetingDertailsSeguimiento(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateMeetingDetails(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateOrdenCompra(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateOrdenCompraAuth(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdatePersonData(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdatePersonProviderSupport(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdatePiscina(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdatePiscinaBitacora(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdatePresentacionJuntaComite(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdatePresupuestoDetalleEdicion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateProviders(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateQualificationProvider(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateRadioComunicacion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateRequestEmployeeRegister(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateSalidaProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateSolicitudCompra(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateSolicitudCompraDetalle(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateTicket(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateTicketSeguimiento(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateTicketTracking(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateTool(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateWeeklyWorkPlan(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateWeeklyWorkPlanNew(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
}
