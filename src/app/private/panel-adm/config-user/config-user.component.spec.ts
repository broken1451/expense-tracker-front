import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUserComponent } from './config-user.component';

describe('ConfigUserComponent', () => {
  let component: ConfigUserComponent;
  let fixture: ComponentFixture<ConfigUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
