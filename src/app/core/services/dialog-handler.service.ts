import { Injectable, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogSize } from '../enums/dialog-size';

@Injectable({
  providedIn: 'root',
})
export class DialogHandlerService {
  dialogService = inject(DialogService);

  openDialog(
    component: any,
    data: any,
    title: string,
    size: DialogSize
  ): Promise<boolean> {
    const ref = this.dialogService.open(component, {
      data,
      header: title,
      styleClass: this.getResponsiveDialogSize(size),
      // styleClass: size,
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    return this.subscribeToDialogClose(ref);
  }

  private subscribeToDialogClose(ref: any): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      ref.onClose.subscribe((resp: any) => {
        if (resp) resolve(resp);
      });
    });
  }

  // Mantiene el tamaño inicial, pero ajusta si la pantalla es pequeña
  private getResponsiveDialogSize(initialSize: DialogSize): DialogSize {
    const width = window.innerWidth;

    if (width < 576) {
      return DialogSize.full; // Pantallas pequeñas, modal ocupa el 100%
    }

    // Retorna el tamaño inicial si la pantalla es más grande
    return initialSize;
  }

  dialogSizeSm: DialogSize = DialogSize.sm;
  dialogSizeMd: DialogSize = DialogSize.md;
  dialogSizeLg: DialogSize = DialogSize.lg;
  dialogSizeFull: DialogSize = DialogSize.full;
}
