import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeAddOrEditService {
  applicationUserId = '';
  employeeId: number = 0;
  nameEmployee: string = '';
  onSetId(applicationUserId: string) {
    this.applicationUserId = applicationUserId;
  }

  onSetEmployeeId(employeeId: number) {
    this.employeeId = employeeId;
  }
  onSetNameEmployee(nameEmployee: string) {
    this.nameEmployee = nameEmployee;
  }

  onGetId() {
    return this.applicationUserId;
  }
  onGetEmployeeId() {
    return this.employeeId;
  }

  onGetNameEmployee() {
    return this.nameEmployee;
  }
}
