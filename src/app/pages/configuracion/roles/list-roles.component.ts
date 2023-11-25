import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [MessageService, CustomToastService],
})
export default class ListRolesComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.get('Roles').subscribe({
      next: (resp: any) => {
        this.data = resp.body;
        this.customToastService.onClose();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
