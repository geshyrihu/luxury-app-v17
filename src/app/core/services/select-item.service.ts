import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ISelectItemCheckDto,
  ISelectItemDto,
} from 'src/app/core/interfaces/ISelectItemDto.interface';
import { environment } from 'src/environments/environment';
import { CustomerIdService } from './customer-id.service';
import { DataService } from './data.service';
const urlBase = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class SelectItemService {
  private http = inject(HttpClient);
  private dataService = inject(DataService);
  private customerIdService = inject(CustomerIdService);

  subRef$: Subscription;

  customer: ISelectItemDto[] = [];
  professions: ISelectItemDto[] = [];
  allEmployeeActive: ISelectItemDto[] = [];
  employeeFromCustomer: ISelectItemDto[] = [];

  constructor() {
    this.onGetProfessions();
    this.onGetAllEmployee();
    this.onGetEmployeeFromCustomer();
  }

  onGetProfessions() {
    this.subRef$ = this.dataService.get('SelectItem/Professions').subscribe({
      next: (resp: any) => {
        this.professions = resp.body;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onGetAllEmployee() {
    this.subRef$ = this.dataService
      .get('SelectItem/GetAllEmployeeActive')
      .subscribe({
        next: (resp: any) => {
          this.allEmployeeActive = resp.body;
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  onGetEmployeeFromCustomer() {
    this.subRef$ = this.dataService
      .get(
        `SelectItem/GetAllEmployeeActive/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          this.employeeFromCustomer = resp.body;
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  onGetSelectItem(urlApi: string): Observable<ISelectItemDto[]> {
    const dataSubject = new Subject<ISelectItemDto[]>();
    this.dataService.get<ISelectItemDto[]>('SelectItem/' + urlApi).subscribe({
      next: (resp: any) => {
        dataSubject.next(resp.body);
        dataSubject.complete();
      },
      error: (err) => {
        console.error(err.error);
        dataSubject.error(err.error);
      },
    });
    return dataSubject.asObservable();
  }
  onGetSelectItemCheck(urlApi: string): Observable<ISelectItemCheckDto[]> {
    const dataSubject = new Subject<ISelectItemCheckDto[]>();
    this.dataService.get<ISelectItemDto[]>('SelectItem/' + urlApi).subscribe({
      next: (resp: any) => {
        dataSubject.next(resp.body);
        dataSubject.complete();
      },
      error: (err) => {
        console.error(err.error);
        dataSubject.error(err.error);
      },
    });
    return dataSubject.asObservable();
  }

  onGetSelectItemEnum(params: string): Observable<ISelectItemDto[]> {
    const dataSubject = new Subject<ISelectItemDto[]>();

    this.dataService
      .get<ISelectItemDto[]>('SelectItemEnum/' + params)
      .subscribe({
        next: (resp: any) => {
          dataSubject.next(resp.body);
          dataSubject.complete();
        },
        error: (err) => {
          console.error('error onGetSelectItemEnum', err);
          dataSubject.error(err);
        },
      });

    return dataSubject.asObservable();
  }

  getCustomersNombreCorto() {
    return this.http.get(urlBase + 'SelectItem/NombreCorto').pipe(
      map((resp: any[]) =>
        resp.map((selectList) => ({
          label: selectList.label,
          // value: selectList.value,
        }))
      )
    );
  }

  getEmpleadosSolicitudTicket(data: any) {
    return this.http
      .post(urlBase + 'SelectItem/EmpleadosSolicitudTicket', data)
      .pipe(
        map((resp: any[]) =>
          resp.map((selectList) => ({
            value: selectList.value,
            label: selectList.label,
          }))
        )
      );
  }
}
