import { Injectable, inject } from '@angular/core';
import { ISelectItem } from '../interfaces/select-Item.interface';
import { ApiRequestService } from './api-request.service';

@Injectable({
  providedIn: 'root',
})
export class EnumSelectService {
  apiRequestService = inject(ApiRequestService);

  enumDepartament: ISelectItem[] = [];

  onGetEnumDepartament() {
    const urlApi = `EnumSelect/Departament`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.enumDepartament = result;
    });
  }
}
