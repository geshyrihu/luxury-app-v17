import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
    selector: 'app-inspections-areas',
    imports: [LuxuryAppComponentsModule],
    templateUrl: './inspections-areas.component.html'
})
export default class InspectionsAreasComponent {
  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    console.log('onModalAddOrEdit', data);
  }
}
