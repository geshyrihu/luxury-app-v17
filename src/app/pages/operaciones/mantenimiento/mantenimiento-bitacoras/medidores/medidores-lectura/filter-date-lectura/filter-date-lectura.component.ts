// import { CommonModule } from '@angular/common';
// import { Component, OnInit, inject } from '@angular/core';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { DateService } from 'src/app/core/services/date.service';
// import ComponentsModule from 'src/app/shared/components.module';

// const date = new Date();
// const mesActual = date.getMonth();
// const mesAnterior = new Date(date.getFullYear(), mesActual - 1, date.getDate());
// @Component({
//   selector: 'app-filter-date-lectura',
//   templateUrl: './filter-date-lectura.component.html',
//   standalone: true,
//   imports: [CommonModule, ComponentsModule],
// })
// export default class FilterDateLecturaComponent implements OnInit {
//   public dateService = inject(DateService);
//   public ref = inject(DynamicDialogRef);
//   public config = inject(DynamicDialogConfig);
//   tipe: string = this.config.data.tipe;

//   cb_Years: any[] = this.onLoadYears();

//   initialMonthNow: number = date.getMonth() - 1;
//   finalMonthNow: number = date.getMonth();
//   finalYearNow: number = date.getFullYear();
//   initialYearNow: number = date.getFullYear();

//   initialDate = this.dateService.getDateFormatmesAnterior();
//   finalDate = this.dateService.getDateFormat(date);

//   ngOnInit(): void {
//     this.onLoadYears();
//   }

//   onSendMonth() {
//     this.ref.close({
//       initialMonthNow: this.initialMonthNow,
//       finalMonthNow: this.finalMonthNow,
//       finalYearNow: this.finalYearNow,
//       initialYearNow: this.initialYearNow,
//     });
//   }
//   onSendDay() {
//     this.ref.close({
//       initialDate: this.initialDate,
//       finalDate: this.finalDate,
//     });
//   }

//   onLoadYears(): any[] {
//     const date = new Date();

//     var cb: any[] = [{ value: date.getFullYear(), label: date.getFullYear() }];

//     for (var i = date.getFullYear() - 10; i < date.getFullYear(); i++) {
//       cb.push({
//         value: i,
//         label: i,
//       });
//     }

//     return cb;
//   }
// }
