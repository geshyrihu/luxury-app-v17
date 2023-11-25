import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
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
  imports: [CommonModule],
})
export default class EmployeeToWorkPositionComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;
  workPositionId: number = 0;
  ngOnInit() {
    this.workPositionId = this.config.data.workPositionId;
  }

  searchExistingPerson(fullName: any) {
    this.existingPerson = [];
    this.subRef$ = this.dataService
      .get('Employees/SearchExistingPersonModal/' + fullName.target.value)
      .subscribe({
        next: (resp) => {
          this.existingPerson = resp.body;
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
        this.subRef$ = this.dataService
          .get(`WorkPosition/AssignEmployee/${personId}/${this.workPositionId}`)
          .subscribe({
            next: () => {
              this.customToastService.onCloseToSuccess();
            },
            error: (err: any) => {
              // En caso de error, mostrar un mensaje de error y registrar el error en la consola
              this.customToastService.onCloseToError();
              console.log(err.error);
            },
          });
      }
    });
  }
}
