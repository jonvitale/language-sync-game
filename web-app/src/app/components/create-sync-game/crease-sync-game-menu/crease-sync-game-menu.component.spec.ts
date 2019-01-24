import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaseSyncGameMenuComponent } from './crease-sync-game-menu.component';

describe('CreaseSyncGameMenuComponent', () => {
  let component: CreaseSyncGameMenuComponent;
  let fixture: ComponentFixture<CreaseSyncGameMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreaseSyncGameMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaseSyncGameMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
