// import { CommonModule } from '@angular/common';
// import { Component, Input, OnInit, forwardRef } from '@angular/core';
// import {
//   ControlValueAccessor,
//   FormControl,
//   NG_VALUE_ACCESSOR,
// } from '@angular/forms';
// import { EditorModule } from 'primeng/editor';
// @Component({
//   selector: 'custom-input-editor',
//   templateUrl: './custom-input-editor.component.html',
//   standalone: true,
//   imports: [CommonModule, EditorModule],
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => CustomInputEditorComponent),
//       multi: true,
//     },
//   ],
// })
// export default class CustomInputEditorComponent
//   implements ControlValueAccessor, OnInit
// {
//   writeValue(obj: any): void {}
//   @Input() control: FormControl;
//   @Input() placeholder: FormControl;
//   @Input() horizontal: boolean = true;
//   @Input() label: string = '';
//   @Input() readonly: boolean = false;
//   @Input() hidden: boolean = false;
//   onChange: any;
//   onTouch: any;
//   disabled: boolean;

//   ngOnInit(): void {
//     this.disabled = this.control?.disabled || false;
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouch = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.disabled = isDisabled;
//   }

//   // Otros métodos y lógica del componente
// }
