import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from './auth.service';
import { CustomToastService } from './custom-toast.service';
import { DataService } from './data.service';
import { DialogHandlerService } from './dialog-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CustomService {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogHandlerService = inject(DialogHandlerService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
}
