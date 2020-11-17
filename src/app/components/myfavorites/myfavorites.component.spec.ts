import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyfavoritesComponent } from './myfavorites.component';

describe('MyfavoritesComponent', () => {
  let component: MyfavoritesComponent;
  let fixture: ComponentFixture<MyfavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyfavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyfavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
