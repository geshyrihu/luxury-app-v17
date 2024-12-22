import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
  selector: 'app-inspections-areas',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './inspections-areas.component.html',
})
export default class InspectionsAreasComponent {
  data: any = [
    {
      id: '1',
      ubicacion: 1,
      area: 'Alberca',

      inspecciones: [
        { id: 1, actividad: 'Iluminacion' },
        { id: 2, actividad: 'Puertas' },
        { id: 3, actividad: 'Venecianos' },
        { id: 4, actividad: 'Fugas' },
        { id: 5, actividad: 'Filtros' },
      ],
    },
    {
      id: '2',
      ubicacion: 2,
      area: 'Gimnasio',
      inspecciones: [
        { id: 1, actividad: 'Iluminacion' },
        { id: 2, actividad: 'Equipos de entrenamiento' },
        { id: 3, actividad: 'Ventilación' },
        { id: 4, actividad: 'Estructura' },
      ],
    },
    {
      id: '3',
      ubicacion: 3,
      area: 'Área 3',
      inspecciones: [
        { id: 1, actividad: 'Puertas' },
        { id: 2, actividad: 'Ventanas' },
        { id: 3, actividad: 'Sistemas de seguridad' },
      ],
    },
    {
      id: '4',
      ubicacion: 4,
      area: 'Área 4',
      inspecciones: [
        { id: 1, actividad: 'Revisión eléctrica' },
        { id: 2, actividad: 'Revisión estructural' },
        { id: 3, actividad: 'Sistemas de agua' },
      ],
    },
    {
      id: '5',
      ubicacion: 5,
      area: 'Área 5',
      inspecciones: [
        { id: 1, actividad: 'Iluminacion' },
        { id: 2, actividad: 'Puertas' },
        { id: 3, actividad: 'Fugas' },
        { id: 4, actividad: 'Ventilación' },
      ],
    },
  ];

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    console.log('onModalAddOrEdit', data);
  }
}
