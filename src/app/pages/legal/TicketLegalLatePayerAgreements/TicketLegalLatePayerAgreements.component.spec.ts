/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketLegalLatePayerAgreementsComponent } from './TicketLegalLatePayerAgreements.component';

describe('TicketLegalLatePayerAgreementsComponent', () => {
  let component: TicketLegalLatePayerAgreementsComponent;
  let fixture: ComponentFixture<TicketLegalLatePayerAgreementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketLegalLatePayerAgreementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketLegalLatePayerAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
