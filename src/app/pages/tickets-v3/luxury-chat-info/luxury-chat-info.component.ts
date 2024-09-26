import { Component, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-luxury-chat-info',
  templateUrl: './luxury-chat-info.component.html',
  standalone: true,
})
export class LuxuryChatInfoComponent {
  config = inject(DynamicDialogConfig);

  description = this.config.data.description;
  /**
   *
   */
  constructor() {
    console.log('🚀 ~ this.config.data.description:', this.config.data);
  }
}
