import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRequestComponent } from './shop-request.component';

describe('ShopRequestComponent', () => {
  let component: ShopRequestComponent;
  let fixture: ComponentFixture<ShopRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
