import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTimingComponent } from './play-timing.component';

describe('PlayTimingComponent', () => {
  let component: PlayTimingComponent;
  let fixture: ComponentFixture<PlayTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
