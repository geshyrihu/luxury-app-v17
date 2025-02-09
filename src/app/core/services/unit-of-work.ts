import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { DialogHandlerService } from './dialog-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UnitOfWork {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
}
