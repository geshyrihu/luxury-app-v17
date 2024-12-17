import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
  selector: 'app-catalog-color',
  templateUrl: './catalog-color.component.html',
  styleUrls: ['./catalog-color.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, LuxuryAppComponentsModule],
})
export default class CatalogColorComponent {
  // Definir las paletas de colores
  palettes = [
    {
      name: 'Lujo Clásico',
      primaryColor: '#2c3e50', // Azul oscuro (60%)
    },
    {
      name: 'Minimalismo Sofisticado',
      primaryColor: '#007580', // Azul petróleo (60%)
    },
    {
      name: 'Tecnología de Lujo',
      primaryColor: '#d4af37', // Negro carbón (60%)
    },
    {
      name: 'Exclusividad y Seriedad',
      primaryColor: '#2a2d45', // Azul noche (60%)
    },
    {
      name: 'Naturaleza Sofisticada',
      primaryColor: '#264653', // Verde oscuro (60%)
    },
    {
      name: 'Naturaleza',
      primaryColor: '#1a4731', // Verde bosque (60%)
    },
  ];

  selectPalette(palette: any) {
    // Cambiar la variable CSS --primary-color al color seleccionado
    document.documentElement.style.setProperty(
      '--primary-color',
      palette.primaryColor
    );
  }

  constructor() {
    // Establecer la paleta por defecto
    this.selectPalette(this.palettes[0]);
  }
}
