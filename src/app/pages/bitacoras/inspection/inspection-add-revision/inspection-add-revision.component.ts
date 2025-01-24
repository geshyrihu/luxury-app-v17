import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
  selector: 'app-inspection-add-revision',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './inspection-add-revision.component.html',
})
export default class InspectionAddRevisionComponent {}
