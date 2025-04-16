import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaghchalGameComponent } from './baghchal-game.component';

describe('BaghchalGameComponent', () => {
  let component: BaghchalGameComponent;
  let fixture: ComponentFixture<BaghchalGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaghchalGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaghchalGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
