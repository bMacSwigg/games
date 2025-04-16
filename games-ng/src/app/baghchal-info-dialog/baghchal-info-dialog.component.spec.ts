import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaghchalInfoDialogComponent } from './baghchal-info-dialog.component';

describe('BaghchalInfoDialogComponent', () => {
  let component: BaghchalInfoDialogComponent;
  let fixture: ComponentFixture<BaghchalInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaghchalInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaghchalInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
