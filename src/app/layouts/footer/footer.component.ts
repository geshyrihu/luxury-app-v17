import { Component } from '@angular/core';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
})
export default class FooterComponent {
  year: number = new Date().getFullYear();
}
