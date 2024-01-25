/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketLegalEmployeeTerminationsComponent } from './TicketLegalEmployeeTerminations.component';

describe('TicketLegalEmployeeTerminationsComponent', () => {
  let component: TicketLegalEmployeeTerminationsComponent;
  let fixture: ComponentFixture<TicketLegalEmployeeTerminationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketLegalEmployeeTerminationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketLegalEmployeeTerminationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
