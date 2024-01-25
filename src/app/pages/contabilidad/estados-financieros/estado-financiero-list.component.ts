import { Component, OnInit } from '@angular/core';
import PrimeNgModule from 'app/shared/prime-ng.module';

@Component({
  selector: 'app-estado-financiero-list',
  templateUrl: './estado-financiero-list.component.html',
  standalone: true,
  imports: [PrimeNgModule],
  providers: [],
})
export default class EstadoFinancieroListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
