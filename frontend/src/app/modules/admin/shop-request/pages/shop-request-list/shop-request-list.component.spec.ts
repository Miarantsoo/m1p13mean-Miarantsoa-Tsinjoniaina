import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRequestListComponent } from './shop-request-list.component';

describe('ShopRequestListComponent', () => {
  let component: ShopRequestListComponent;
  let fixture: ComponentFixture<ShopRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
