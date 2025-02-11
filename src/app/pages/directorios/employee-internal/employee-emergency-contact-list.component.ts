import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';
import EmployeeEmergencyContactAddOrEditComponent from './employee-emergency-contact-add-or-edit.component';

@Component({
  selector: 'employee-emergency-contact-list',
  templateUrl: './employee-emergency-contact-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EmployeeEmergencyContactListComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  formB = inject(FormBuilder);

  @Input()
  employeeId: number = 0;

  id: string = '';
  contactEmployeeAdd: any;

  dataEmergencyContact: any = [];
  dataBeneficiary: any = [];
  ngOnInit() {
    if (this.employeeId !== 0 && this.employeeId !== undefined) {
      this.onLoadDataEmergencyContact();
      this.onLoadDataBeneficiary();
    }
  }

  onLoadDataEmergencyContact() {
    const urlApi = `EmployeeEmergencyContact/ListEmployeeContact/${
      this.employeeId
    }/${0}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.dataEmergencyContact = responseData;
    });
  }
  onLoadDataBeneficiary() {
    const urlApi = `EmployeeEmergencyContact/ListEmployeeContact/${
      this.employeeId
    }/${1}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.dataBeneficiary = responseData;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        EmployeeEmergencyContactAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.onLoadDataBeneficiary();
          this.onLoadDataEmergencyContact();
        }
      });
  }

  onDelete(id: string, typeContact: number) {
    this.apiRequestS
      .onDelete(`EmployeeEmergencyContact/${id}`)
      .then((responseData: any) => {
        if (responseData) {
          if (typeContact === 0) {
            this.dataEmergencyContact = this.dataEmergencyContact.filter(
              (item) => item.id !== id
            );
          }
          if (typeContact === 1) {
            this.dataBeneficiary = this.dataBeneficiary.filter(
              (item) => item.id !== id
            );
          }
        }
      });
  }
}
