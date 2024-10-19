import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import BtnComponent from 'src/app/custom-components/custom-buttons/a-master-btn-button/a-master-btn.component';
@Component({
  selector: 'custom-table-caption',
  templateUrl: './custom-table-caption.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltip, BtnComponent],
})
export default class CustomTableCaptionComponent {
  private location = inject(Location);

  @Input()
  title: string = '';
  @Input()
  dt: any;
  @Input()
  showAdd: boolean = true;
  @Input()
  label: string = 'Agregar';
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
