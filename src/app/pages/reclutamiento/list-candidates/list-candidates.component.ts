import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';

const dateNow = new Date();

@Component({
  selector: 'app-list-candidates',
  templateUrl: './list-candidates.component.html',
  standalone: true,
  imports: [TableModule, ComponentsModule, FlatpickrModule],
  providers: [MessageService, CustomToastService],
})
export default class ListCandidatesComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);

  value: Date = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1); //Dia primero del mes actual
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    /**
     * Colocar calendario en español
     */
    flatpickrFactory();
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Candidate/${this.dateService.getDateFormat(this.value)}`)
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
