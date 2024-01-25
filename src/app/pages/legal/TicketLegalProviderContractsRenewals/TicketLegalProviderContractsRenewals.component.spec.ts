/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketLegalProviderContractsRenewalsComponent } from './TicketLegalProviderContractsRenewals.component';

describe('TicketLegalProviderContractsRenewalsComponent', () => {
  let component: TicketLegalProviderContractsRenewalsComponent;
  let fixture: ComponentFixture<TicketLegalProviderContractsRenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketLegalProviderContractsRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketLegalProviderContractsRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
