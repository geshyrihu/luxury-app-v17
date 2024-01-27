import { Injectable, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomToastService } from './custom-toast.service';

@Injectable({
  providedIn: 'root',
})
export class DialogHandlerService {
  private dialogService = inject(DialogService);
  private customToastService = inject(CustomToastService);

  openDialog(
    component: any,
    data: any,
    title: string,
    size: DialogSize
  ): Promise<boolean> {
    const ref = this.dialogService.open(component, {
      data,
      header: title,
      styleClass: size,
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    return this.subscribeToDialogClose(ref);
  }
  justOpenDialog(
    component: any,
    data: any,
    title: string,
    size: DialogSize
  ): void {
    const ref = this.dialogService.open(component, {
      data,
      header: title,
      styleClass: size,
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    this.subscribeToDialogClose(ref);
  }

  private subscribeToDialogClose(ref: any): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      ref.onClose.subscribe((resp: boolean) => {
        if (resp) {
          this.customToastService.onShowSuccess();
          // Puedes agregar más lógica aquí si es necesario
        }
        resolve(resp);
      });
    });
  }
}

export enum DialogSize {
  sm = 'modal-sm',
  md = 'modal-md',
  lg = 'modal-lg',
  full = 'modal-w-100',
}
