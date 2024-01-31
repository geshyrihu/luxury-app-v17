import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
@Component({
  selector: 'app-provider-support-customer',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule],
  templateUrl: './provider-support-customer.component.html',
})
export default class ProviderSupportCustomerComponent implements OnInit {
  ngOnInit(): void {}
}
