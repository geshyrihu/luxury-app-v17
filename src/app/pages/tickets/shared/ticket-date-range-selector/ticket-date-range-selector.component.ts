import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { DateRangeStorageService } from '../../services/date-range-storage.service';

@Component({
  selector: 'app-ticket-date-range-selector',
  templateUrl: './ticket-date-range-selector.component.html',
  standalone: true,
  imports: [FlatpickrModule, FormsModule],
})
export default class TicketDateRangeSelectorComponent implements OnInit {
  constructor(private dateRangeStorageService: DateRangeStorageService) {
    flatpickrFactory();
  }

  // Modificamos la declaración de dateRange para que use un objeto con from y to
  dateRange: { from: Date | null; to: Date | null } = { from: null, to: null };

  ngOnInit(): void {
    // Recuperar las fechas guardadas cuando el componente se inicializa
    const savedDateRange = this.dateRangeStorageService.getDateRange();
    if (savedDateRange.from && savedDateRange.to) {
      this.dateRange = savedDateRange;
      this.emitSelectedDates(); // Emitir los valores recuperados
    }
  }

  @Output() selectedDates = new EventEmitter<{
    startDate: Date;
    endDate: Date;
  }>();

  onDateChange(dates: { from: Date | null; to: Date | null }) {
    this.dateRange = dates;
  }

  emitSelectedDates() {
    // Comprobamos que las fechas from y to no sean nulas
    if (this.dateRange.from && this.dateRange.to) {
      this.selectedDates.emit({
        startDate: this.dateRange.from,
        endDate: this.dateRange.to,
      });
      // Guardar las fechas seleccionadas
      this.dateRangeStorageService.saveDateRange(
        this.dateRange.from,
        this.dateRange.to
      );
    }
  }
}
