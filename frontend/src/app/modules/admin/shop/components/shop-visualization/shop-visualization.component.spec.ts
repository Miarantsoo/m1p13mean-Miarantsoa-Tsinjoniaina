import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopVisualizationComponent } from './shop-visualization.component';

describe('ShopVisualizationComponent', () => {
  let component: ShopVisualizationComponent;
  let fixture: ComponentFixture<ShopVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
