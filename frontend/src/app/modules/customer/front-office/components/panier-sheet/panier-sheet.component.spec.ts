import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierSheetComponent } from './panier-sheet.component';

describe('PanierSheetComponent', () => {
  let component: PanierSheetComponent;
  let fixture: ComponentFixture<PanierSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanierSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
