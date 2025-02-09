import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

export function flatpickrFactory() {
  flatpickr.localize(Spanish);
  return flatpickr;
}
