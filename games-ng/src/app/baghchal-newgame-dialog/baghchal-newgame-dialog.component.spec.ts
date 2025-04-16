import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaghchalNewgameDialogComponent } from './baghchal-newgame-dialog.component';

describe('BaghchalNewgameDialogComponent', () => {
  let component: BaghchalNewgameDialogComponent;
  let fixture: ComponentFixture<BaghchalNewgameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaghchalNewgameDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaghchalNewgameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
