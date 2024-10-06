/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DateRangeStorageService } from './date-range-storage.service';

describe('Service: DateRangeStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateRangeStorageService]
    });
  });

  it('should ...', inject([DateRangeStorageService], (service: DateRangeStorageService) => {
    expect(service).toBeTruthy();
  }));
});
