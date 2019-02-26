import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimingComponent } from './create-timing.component';

describe('CreateTimingComponent', () => {
  let component: CreateTimingComponent;
  let fixture: ComponentFixture<CreateTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
