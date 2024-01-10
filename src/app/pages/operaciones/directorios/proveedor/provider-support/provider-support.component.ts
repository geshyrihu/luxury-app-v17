import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-support.component.html',
})
export default class ProviderSupportComponent implements OnInit {
  ngOnInit(): void {}
}
