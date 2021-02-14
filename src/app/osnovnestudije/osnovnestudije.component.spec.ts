import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsnovnestudijeComponent } from './osnovnestudije.component';

describe('OsnovnestudijeComponent', () => {
  let component: OsnovnestudijeComponent;
  let fixture: ComponentFixture<OsnovnestudijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsnovnestudijeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OsnovnestudijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
