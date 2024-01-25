import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ISelectItemCheckDto,
  ISelectItemDto,
} from 'src/app/core/interfaces/ISelectItemDto.interface';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
const urlBase = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class SelectItemService {
  private http = inject(HttpClient);
  private dataService = inject(DataService);

  subRef$: Subscription;
  customer: ISelectItemDto[] = [];

  onGetSelectItem(urlApi: string): Observable<ISelectItemDto[]> {
    const dataSubject = new Subject<ISelectItemDto[]>();
    this.dataService.get<ISelectItemDto[]>('selectitem/' + urlApi).subscribe({
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

  getCustomersNombreCorto() {
    return this.http.get(urlBase + 'SelectItem/NombreCorto').pipe(
      map((resp: any[]) =>
        resp.map((selectList) => ({
          label: selectList.label,
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
