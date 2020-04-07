import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgFastComponent } from './img-fast.component';

describe('ImgFastComponent', () => {
  let component: ImgFastComponent;
  let fixture: ComponentFixture<ImgFastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgFastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
