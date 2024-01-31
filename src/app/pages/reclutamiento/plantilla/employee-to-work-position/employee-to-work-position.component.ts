import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employee-to-work-position',
  templateUrl: './employee-to-work-position.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule],
})
export default class EmployeeToWorkPositionComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  workPositionId: number = 0;
  ngOnInit() {
    this.workPositionId = this.config.data.workPositionId;
  }

  searchExistingPerson(fullName: any) {
    this.existingPerson = [];
    this.dataService
      .get('Employees/SearchExistingPersonModal/' + fullName.target.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp) => {
          this.existingPerson = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  existingPerson: any;

  onSelectEmployee(personId: number, nameEmployee: string) {
    //todo: implementa swat
    Swal.fire({
      title: '¿Estas seguro?',
      text: `Se va a registrar a ${nameEmployee} a este puesto de trabajo`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, adelante',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        // Mostrar un mensaje de carga
        this.customToastService.onLoading();
        this.dataService
          .get(`WorkPosition/AssignEmployee/${personId}/${this.workPositionId}`)
          .subscribe({
            next: () => {
              this.customToastService.onCloseToSuccess();
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
