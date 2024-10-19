import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';

import CustomTableCaptionComponent from './custom-table-caption/custom-table-caption.component';
import TableFooterComponent from './table-footer/table-footer.component';

@NgModule({
  imports: [TableModule, TableFooterComponent, CustomTableCaptionComponent],
  exports: [TableModule, TableFooterComponent, CustomTableCaptionComponent],
})
export default class TablePrimeNgModule {}
