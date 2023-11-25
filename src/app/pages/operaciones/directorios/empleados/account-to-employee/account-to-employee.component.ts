import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
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
  imports: [CommonModule, PrimeNgModule],
  providers: [CustomToastService],
})
export default class AccountToEmployeeComponent implements OnInit {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);

  private customerIdService = inject(CustomerIdService);

  submitting: boolean = false;
  id: number = 0;
  applicationUserId: string = this.config.data.applicationUserId;
  applicationUserList: any[] = [];
  subRef$: Subscription;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.onLoadAccount();
  }
  onLoadData() {
    this.subRef$ = this.dataService.get(`Banks/${this.id}`).subscribe({
      next: (resp: any) => {},
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }

  onRadioChange(newValue: string) {
    // Esta función se llamará cada vez que cambie el valor del radio button
    this.applicationUserId = newValue;
    // Realiza las acciones que desees con el nuevo valor aquí
  }

  onSubmit() {
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        `Accounts/UpdateAccountToEmployee/${this.id}/${this.applicationUserId}`
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onLoadAccount() {
    this.subRef$ = this.dataService
      .get(
        `Employees/GetListAccountUser/${this.customerIdService.customerId}/${this.id}`
      )
      .subscribe({
        next: (resp: any) => {
          this.applicationUserList = resp.body;
        },
        error: (err) => {
          console.log(err.error);
          this.customToastService.onShowError();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
