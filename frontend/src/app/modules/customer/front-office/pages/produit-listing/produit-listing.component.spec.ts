import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitListingComponent } from './produit-listing.component';

describe('ProduitListingComponent', () => {
  let component: ProduitListingComponent;
  let fixture: ComponentFixture<ProduitListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProduitListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
