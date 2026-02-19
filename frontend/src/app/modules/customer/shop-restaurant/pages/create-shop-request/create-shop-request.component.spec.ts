import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShopRequestComponent } from './create-shop-request.component';

describe('CreateShopRequestComponent', () => {
  let component: CreateShopRequestComponent;
  let fixture: ComponentFixture<CreateShopRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateShopRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShopRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
