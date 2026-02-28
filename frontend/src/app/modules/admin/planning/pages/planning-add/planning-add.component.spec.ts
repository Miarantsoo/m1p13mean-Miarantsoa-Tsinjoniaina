import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningAddComponent } from './planning-add.component';

describe('PlanningAddComponent', () => {
  let component: PlanningAddComponent;
  let fixture: ComponentFixture<PlanningAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
