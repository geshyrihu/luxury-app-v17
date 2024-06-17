import { Component, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
  selector: 'app-list-ticket-for-departament',
  templateUrl: './list-ticket-for-departament.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListTicketForDepartamentComponent implements OnInit {
  data: any[] = [];
  ngOnInit() {}
}
