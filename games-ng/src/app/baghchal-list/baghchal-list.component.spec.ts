import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaghchalListComponent } from './baghchal-list.component';

describe('BaghchalListComponent', () => {
  let component: BaghchalListComponent;
  let fixture: ComponentFixture<BaghchalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaghchalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaghchalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
