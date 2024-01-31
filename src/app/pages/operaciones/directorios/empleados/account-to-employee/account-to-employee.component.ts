import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
@Component({
  selector: 'app-account-to-employee',
  templateUrl: './account-to-employee.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule, PrimeNgModule],
  providers: [CustomToastService, DataService],
})
export default class AccountToEmployeeComponent implements OnInit {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);
  private customerIdService = inject(CustomerIdService);
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;
  personId: number = 0;
  applicationUserId: string = this.config.data.applicationUserId;
  applicationUserList: any[] = [];

  ngOnInit() {
    this.personId = this.config.data.personId;
    this.onLoadAccount();
  }

  onRadioChange(newValue: string) {
    // Esta función se llamará cada vez que cambie el valor del radio button
    this.applicationUserId = newValue;
    // Realiza las acciones que desees con el nuevo valor aquí
  }

  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        `accounts/updateaccounttoemployee/${this.personId}/${this.applicationUserId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadAccount() {
    this.dataService
      .get(
        `Employees/GetListAccountUser/${this.customerIdService.customerId}/${this.personId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.applicationUserList = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
