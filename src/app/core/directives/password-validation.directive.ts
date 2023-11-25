import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidatorFn,
} from '@angular/forms';

// Esta función factory devuelve una función validadora personalizada.
export function passwordValidation(): ValidatorFn {
  return (control: AbstractControl) => {
    const passwordValidationDirective = new PasswordValidationDirective();
    return passwordValidationDirective.validate(control);
  };
}

@Directive({
  selector: '[passwordValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidationDirective,
      multi: true,
    },
  ],
})
export class PasswordValidationDirective implements Validator {
  passwordsProhibidos = ['123456', 'querty', '123456789'];

  // Este método se llama cuando se valida un control con la directiva.
  validate(
    control: import('@angular/forms').AbstractControl
  ): import('@angular/forms').ValidationErrors {
    const password = <string>control.value;

    if (!password) {
      return;
    }
    if (password.length < 6) {
      // Devuelve un error de validación si la longitud del password es menor que 6.
      return {
        passwordValidation: {
          message: 'El password debe ser de mínimo 6 caracteres',
        },
      };
    }

    if (this.passwordsProhibidos.indexOf(password) !== -1) {
      // Devuelve un error de validación si el password está en la lista de contraseñas prohibidas.
      return { passwordValidation: { message: 'Escoge un mejor password' } };
    }

    if (password === password.toLowerCase()) {
      // Devuelve un error de validación si el password no contiene letras mayúsculas.
      return {
        passwordValidation: {
          message: 'Tu password debe de contener mayúsculas',
        },
      };
    }

    if (password === password.toUpperCase()) {
      // Devuelve un error de validación si el password no contiene letras minúsculas.
      return {
        passwordValidation: {
          message: 'Tu password debe de contener minúsculas',
        },
      };
    }

    if (!/\d/.test(password)) {
      // Devuelve un error de validación si el password no contiene un caracter numérico.
      return {
        passwordValidation: {
          message: 'Tu password debe de incluir un caracter numérico',
        },
      };
    }

    // Si no se encuentra ningún error de validación, devuelve null.
    return null;
  }
}
