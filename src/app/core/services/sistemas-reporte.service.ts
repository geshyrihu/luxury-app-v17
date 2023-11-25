import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SistemasReporteService {
  private dataService = inject(DataService);

  subRef$: Subscription;
  data: any[] = [];
  applicationUser: any[] = [];

  get dataReport(): any[] {
    return this.data;
  }
  buscarApplicationUser(termino: string): any[] {
    this.subRef$ = this.dataService
      .get('SelectItem/applicationUser/' + termino)
      .subscribe((resp: any) => {
        this.applicationUser = resp.body;
      });

    return this.applicationUser;
  }

  setData(data: any) {
    this.data = data;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
