import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
  selector: 'app-mesanio',
  templateUrl: './mesanio.component.html',
  standalone: true,
  imports: [FormsModule, NgbTooltip],
})
export default class MesanioComponent implements OnInit {
  @Output() periodoEmit = new EventEmitter<string>();
  periodo: any;
  private periodo$ = new Subject<number>();
  constructor(private rangoCalendarioService: FiltroCalendarService) {}

  ngOnInit(): void {
    this.periodo = this.onParseToInputMonth(
      this.rangoCalendarioService.fechaInicial
    );
  }
  //Convertir fechas recibidas a input Month HTML
  onParseToInputMonth(date: Date): string {
    const mm = date.getMonth() + 1;
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm].join('-');
  }

  onChangePeriodo() {
    this.periodoEmit.emit(this.periodo);
  }

  getPeriodo$(): Observable<any> {
    return this.periodo$.asObservable();
  }
}
