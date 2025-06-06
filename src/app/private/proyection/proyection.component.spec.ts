import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectionComponent } from './proyection.component';

describe('ProyectionComponent', () => {
  let component: ProyectionComponent;
  let fixture: ComponentFixture<ProyectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
