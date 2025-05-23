import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdcComponent } from './tdc.component';

describe('TdcComponent', () => {
  let component: TdcComponent;
  let fixture: ComponentFixture<TdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
