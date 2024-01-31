import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
@Component({
  selector: 'app-provider-support',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule],
  templateUrl: './provider-support.component.html',
})
export default class ProviderSupportComponent implements OnInit {
  ngOnInit(): void {}
}
