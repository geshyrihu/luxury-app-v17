import { Component, OnInit } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  standalone: true,
  imports: [NgbAlert],
  providers: [],
})
export default class PersonEditComponent implements OnInit {
  ngOnInit() {}
}
