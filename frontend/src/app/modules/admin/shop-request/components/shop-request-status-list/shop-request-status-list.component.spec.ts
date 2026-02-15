import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRequestStatusListComponent } from './shop-request-status-list.component';

describe('ShopRequestStatusListComponent', () => {
  let component: ShopRequestStatusListComponent;
  let fixture: ComponentFixture<ShopRequestStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopRequestStatusListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopRequestStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
