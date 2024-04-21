import { NgModule } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
@NgModule({
  imports: [
    TableModule,
    ToastModule,
    CheckboxModule,
    DialogModule,
    ImageModule,
    MenuModule,
    MultiSelectModule,
    InputTextModule,
    EditorModule,
    DragDropModule,
  ],
  exports: [
    TableModule,
    ToastModule,
    CheckboxModule,
    DialogModule,
    ImageModule,
    MenuModule,
    MultiSelectModule,
    InputTextModule,
    EditorModule,
    DragDropModule,
  ],
})
export default class PrimeNgModule {}
