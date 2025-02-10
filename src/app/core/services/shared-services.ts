import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { AuthService } from './auth.service';
import { CustomerIdService } from './customer-id.service';
import { DialogHandlerService } from './dialog-handler.service';

@Injectable({
  providedIn: 'root',
})
export class SharedServices {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);
  authS = inject(AuthService);
}
