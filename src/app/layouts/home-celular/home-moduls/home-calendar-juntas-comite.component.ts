import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-home-calendar-juntas-comite',
    imports: [CommonModule],
    templateUrl: './home-calendar-juntas-comite.component.html'
})
export default class HomeCalendarJuntasComiteComponent {
  opciones = [
    { value: 0, icon: 'fas fa-list-alt', id: '', label: 'Todos' },
    { value: 0, icon: 'fas fa-swimmer', id: 2, label: 'Amenidades' },
    { value: 0, icon: 'fas fa-hotel', id: 8, label: 'Áreas comunes' },
    { value: 0, icon: 'fas fa-door-open', id: 7, label: 'Bodegas' },
    { value: 0, icon: 'fas fa-cogs', id: 1, label: 'Equipos' },
    { value: 0, icon: 'fas fa-dumbbell', id: 5, label: 'Gimnasio' },
    { value: 0, icon: 'fas fa-video', id: 6, label: 'Sistemas' },
    { value: 0, icon: 'fas fa-paint-roller', id: 9, label: 'Pintura' },
    { value: 0, icon: 'fas fa-hammer', id: 11, label: 'Carpintería' },
  ];
}
