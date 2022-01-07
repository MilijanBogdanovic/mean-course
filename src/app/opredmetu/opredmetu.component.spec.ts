import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpredmetuComponent } from './opredmetu.component';

describe('OpredmetuComponent', () => {
  let component: OpredmetuComponent;
  let fixture: ComponentFixture<OpredmetuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpredmetuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpredmetuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
