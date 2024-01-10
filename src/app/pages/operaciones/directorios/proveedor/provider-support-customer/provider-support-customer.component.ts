import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-support-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-support-customer.component.html',
})
export default class ProviderSupportCustomerComponent implements OnInit {
  ngOnInit(): void {}
}
