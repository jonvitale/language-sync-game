import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSyncGameComponent } from './create-sync-game.component';

describe('CreateSyncGameComponent', () => {
  let component: CreateSyncGameComponent;
  let fixture: ComponentFixture<CreateSyncGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSyncGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSyncGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
