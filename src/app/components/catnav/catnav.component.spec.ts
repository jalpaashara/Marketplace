import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatnavComponent } from './catnav.component';

describe('CatnavComponent', () => {
  let component: CatnavComponent;
  let fixture: ComponentFixture<CatnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
