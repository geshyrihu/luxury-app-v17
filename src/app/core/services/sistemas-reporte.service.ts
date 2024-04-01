import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SistemasReporteService {
  dataService = inject(DataService);

  data: any[] = [];
  applicationUser: any[] = [];

  get dataReport(): any[] {
    return this.data;
  }
  buscarApplicationUser(termino: string): any[] {
    this.dataService
      .get('SelectItem/applicationUser/' + termino)
      .subscribe((resp: any) => {
        this.applicationUser = resp.body;
      });

    return this.applicationUser;
  }

  setData(data: any) {
    this.data = data;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
