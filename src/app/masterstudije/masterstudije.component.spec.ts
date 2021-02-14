import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterstudijeComponent } from './masterstudije.component';

describe('MasterstudijeComponent', () => {
  let component: MasterstudijeComponent;
  let fixture: ComponentFixture<MasterstudijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterstudijeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterstudijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
