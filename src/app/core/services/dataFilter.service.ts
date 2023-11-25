import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class DataFilterService {
  private dataService = inject(DataService);

  subRef$: Subscription;
  data: any;
  urlApi: string = `Accounts/GetAll/${true}`;
  get onGetData() {
    let data: any = [];
    this.subRef$ = this.dataService.get(this.urlApi).subscribe({
      next: (resp: any) => {
        data = resp.body;
      },
      error: (err) => {
        data = [];
        console.log(err.error);
      },
    });

    return data;
  }
}
