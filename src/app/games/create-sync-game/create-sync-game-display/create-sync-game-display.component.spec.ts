import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSyncGameDisplayComponent } from './create-sync-game-display.component';

describe('CreateSyncGameDisplayComponent', () => {
  let component: CreateSyncGameDisplayComponent;
  let fixture: ComponentFixture<CreateSyncGameDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSyncGameDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSyncGameDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
