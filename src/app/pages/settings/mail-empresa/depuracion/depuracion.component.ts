import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [LuxuryAppComponentsModule],
  standalone: true,
})
export default class DepuracionComponent {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);

  MigrateAmenities(path: string) {
    const urlApi = `UpdateDataBase/${path}`;
    this.apiRequestS.onGetList(urlApi).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  MigrateEquipos(path: string) {
    const urlApi = `UpdateDataBase/${path}`;

    this.apiRequestS.onGetList(urlApi).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  DeleteDuplicateModuleAppRol(path: string) {
    const urlApi = `UpdateDataBase/${path}`;

    this.apiRequestS.onGetList(urlApi).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  MyModuleApp(path: string) {
    const urlApi = `UpdateDataBase/${path}`;

    this.apiRequestS.onGetList(urlApi).then((resut) => {});
  }
}
