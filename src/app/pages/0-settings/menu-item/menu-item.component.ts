import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MenuItem } from 'primeng/api';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './menu-item.component.html',
})
export default class MenuItemComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  menuItems: MenuItem[] = [];

  // Definición del nuevo elemento de menú
  newMenuItem: MenuItem = {
    id: '', // Puedes usar un valor temporal aquí si es necesario
    label: '',
    icon: '',
    routerLink: '',
    name: '',
    visible: true, // Por defecto, podrías querer que sea visible
    order: 0, // Define un valor por defecto para el orden
  };
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    const urlApi = `MenuItem`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.menuItems = result;
    });
  }

  createMenuItem(newItem: MenuItem): void {
    this.apiRequestService.onPost(`MenuItem`, newItem);
  }

  updateMenuItem(updatedItem: MenuItem): void {}

  deleteMenuItem(id: string): void {}
}
