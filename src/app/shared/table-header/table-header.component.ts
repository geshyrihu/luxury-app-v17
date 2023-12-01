import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import CustomButtonAddComponent from 'src/app/custom-components/custom-buttons/custom-button-add/custom-button-add.component';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltip, CustomButtonAddComponent],
})
export default class TableHeaderComponent {
  private location = inject(Location);

  @Input()
  title: string = '';
  @Input()
  dt: any;
  @Input()
  showAdd: boolean = true;
  @Input()
  rolAuth: boolean = true;
  @Input()
  viewNavigateButton: boolean = true;
  @Input()
  isDataView: boolean = false;

  @Input()
  showSearch: boolean = true;

  @Output() add = new EventEmitter<any>();

  onAdd(data: any) {
    this.add.emit(data);
  }

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }
}
