import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-select-image',
  templateUrl: './custom-select-image.component.html',
  styleUrls: ['./custom-select-image.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export default class CustomSelectImageComponent implements OnInit {
  @Input() items: { value: string; label: string; image: string }[] = [];
  @Input() selectedItem: {
    value: string;
    label: string;
    image: string;
  } | null = null;
  @Output() selectionChange = new EventEmitter<string>();

  dropdownOpen = false;
  urlImage = `${environment.base_urlImg}Administration/customer/`;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectItem(item: { value: string; label: string; image: string }) {
    this.selectedItem = item;
    this.dropdownOpen = false;
    this.selectionChange.emit(item.value);
  }

  ngOnInit() {}
}
