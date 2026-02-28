import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectShopRequestComponent } from './reject-shop-request.component';

describe('RejectShopRequestComponent', () => {
  let component: RejectShopRequestComponent;
  let fixture: ComponentFixture<RejectShopRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectShopRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectShopRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
