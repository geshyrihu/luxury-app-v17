import { Injectable, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class DialogHandlerService {
  private dialogService = inject(DialogService);

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
        if (resp) resolve(resp);
      });
    });
  }

  dialogSizeSm: DialogSize = DialogSize.sm;
  dialogSizeMd: DialogSize = DialogSize.md;
  dialogSizeLg: DialogSize = DialogSize.lg;
  dialogSizeFull: DialogSize = DialogSize.full;
}

export enum DialogSize {
  sm = 'modal-sm',
  md = 'modal-md',
  lg = 'modal-lg',
  full = 'modal-w-100',
}
