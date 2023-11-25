import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  // Esta directiva se aplica directamente en el elemento HTML sin necesidad de un prefijo.
  // Por ejemplo, <textarea appAutosize></textarea>
  standalone: true,
  selector: '[appAutosize]',
})
export class AutosizeDirective {
  constructor(private elementRef: ElementRef) {}

  // El decorador @HostListener se utiliza para escuchar eventos en el elemento anfitrión.
  // En este caso, se escucha el evento ':input', que se dispara cuando se realiza una entrada de usuario.
  @HostListener(':input')
  onInput() {
    // Cuando se produce una entrada, se llama a la función 'resize' para ajustar la altura del elemento.
    this.resize();
  }

  ngOnInit() {
    // Cuando se inicializa la directiva, se verifica si el elemento tiene una altura de desplazamiento.
    if (this.elementRef.nativeElement.scrollHeight) {
      // Se utiliza un setTimeout para asegurarse de que el elemento se haya renderizado antes de ajustar su altura.
      setTimeout(() => this.resize());
    }
  }

  // Esta función ajusta la altura del elemento según su contenido.
  resize() {
    // Primero, se establece la altura en '0' para que el elemento pueda calcular su altura real.
    this.elementRef.nativeElement.style.height = '0';
    // Luego, se establece la altura en la altura real más el sufijo 'px'.
    this.elementRef.nativeElement.style.height =
      this.elementRef.nativeElement.scrollHeight + 'px';
  }
}
