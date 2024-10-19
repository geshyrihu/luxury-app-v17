import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-ticket-individual',
  templateUrl: './ticket-individual.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketIndividualComponent implements OnInit {
  private apiRequestService = inject(ApiRequestService);

  ticketId = '';
  data: any;
  // Dentro de tu componente
  constructor(private route: ActivatedRoute) {
    // Obtener el ticketId de los parámetros de la ruta
    this.route.params.subscribe((params) => {
      this.ticketId = params['ticketId'];
    });
  }
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetItem('TicketLegal/individual/' + this.ticketId)
      .then((result: any) => {
        this.data = result;
      });
  }
}
