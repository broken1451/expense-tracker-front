import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeSystemComponent } from './resume-system.component';

describe('ResumeSystemComponent', () => {
  let component: ResumeSystemComponent;
  let fixture: ComponentFixture<ResumeSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
