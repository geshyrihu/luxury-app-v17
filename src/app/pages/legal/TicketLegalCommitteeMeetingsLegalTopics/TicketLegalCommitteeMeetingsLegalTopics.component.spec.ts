/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketLegalCommitteeMeetingsLegalTopicsComponent } from './TicketLegalCommitteeMeetingsLegalTopics.component';

describe('TicketLegalCommitteeMeetingsLegalTopicsComponent', () => {
  let component: TicketLegalCommitteeMeetingsLegalTopicsComponent;
  let fixture: ComponentFixture<TicketLegalCommitteeMeetingsLegalTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketLegalCommitteeMeetingsLegalTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketLegalCommitteeMeetingsLegalTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
