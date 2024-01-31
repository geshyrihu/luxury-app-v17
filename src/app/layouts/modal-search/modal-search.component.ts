import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { MenuItem } from '../../core/interfaces/menu.model';
@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule],
})
export default class ModalSearchComponent implements OnInit {
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  public ref = inject(DynamicDialogRef);

  menu: MenuItem[] = this.sidebarService.onLoadMenu;
  menuFilter: { name: string; link: string }[] = [];
  private nameLinkList: { name: string; link: string }[] = [];

  ngOnInit() {
    this.mapMenu(this.menu);
  }

  private mapMenu(menuItems: MenuItem[]) {
    for (const item of menuItems) {
      if (item.visible && item.name && item.routerLink) {
        this.nameLinkList.push({
          name: item.name,
          link: item.routerLink,
        });
      }
      if (item.items) {
        this.mapMenu(item.items);
      }
    }
  }

  onSearch(value: string) {
    const searchText = value.toLowerCase();
    this.menuFilter = this.nameLinkList.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
  }
  onNavigate(link: string) {
    this.router.navigate([link]);
    this.ref.close(true);
  }
}
