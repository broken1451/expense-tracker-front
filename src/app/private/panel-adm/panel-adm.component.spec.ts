import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAdmComponent } from './panel-adm.component';

describe('PanelAdmComponent', () => {
  let component: PanelAdmComponent;
  let fixture: ComponentFixture<PanelAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
