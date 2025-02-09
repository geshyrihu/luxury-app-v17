import { NgModule } from '@angular/core';
import StripTagsPipe from './StripTags.pipe';
import { EAreaMinutasDetallesPipe } from './area-minuta-detalles.pipe';
import { EBoolTextPipe } from './bool-text.pipe';
import { CapitalizadoPipe } from './capitalizado.pipe';
import { CelularNumberPipe } from './celular-number.pipe';
import { CurrencyMexicoPipe } from './currencyMexico.pipe';
import PhoneFormatPipe from './phone-format.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { ETipoGastoPipe } from './tipo-gasto.pipe';

@NgModule({
  imports: [
    EAreaMinutasDetallesPipe,
    EBoolTextPipe,
    CapitalizadoPipe,
    CelularNumberPipe,
    CurrencyMexicoPipe,
    PhoneFormatPipe,
    SanitizeHtmlPipe,
    // EStatusOrdenCompraPipe,
    StripTagsPipe,
    ETipoGastoPipe,
    // EStatusPipe,
  ],
  exports: [
    EAreaMinutasDetallesPipe,
    EBoolTextPipe,
    CapitalizadoPipe,
    CelularNumberPipe,
    CurrencyMexicoPipe,
    PhoneFormatPipe,
    SanitizeHtmlPipe,
    // EStatusOrdenCompraPipe,
    StripTagsPipe,
    ETipoGastoPipe,
    // EStatusPipe,
  ],
  declarations: [],
})
export class CustomPipeModule {}
