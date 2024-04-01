import { Component, inject } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-filter-workplan',
  templateUrl: './filter-workplan.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule],
})
export default class FilterWorkplanComponent {
  ref = inject(DynamicDialogRef);
  fechaInicial: Date = new Date(Date.now());
  fechaFinal: Date = new Date();

  constructor() {
    flatpickrFactory();
    this.fechaFinal.setDate(this.fechaInicial.getDate() + 6);
  }

  onFilterWorkplan() {
    this.ref.close({
      fechaInicial: this.fechaInicial,
      fechaFinal: this.fechaFinal,
    });
  }
}
