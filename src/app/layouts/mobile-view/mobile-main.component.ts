import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import MobileFooterComponent from './mobile-footer.component';
import MobileNavbarComponent from './mobile-navbar.component';

@Component({
    selector: 'app-mobile',
    templateUrl: './mobile-main.component.html',
    imports: [RouterModule, MobileNavbarComponent, MobileFooterComponent]
})
export default class MobileMainViewComponent {}
