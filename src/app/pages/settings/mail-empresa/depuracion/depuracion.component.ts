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
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);

  MigrateAmenities(path: string) {
    const urlApi =
      'UpdateDataBase/' + path + '/' + this.custIdService.customerId;
    this.apiRequestService.onGetList(urlApi).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
}
