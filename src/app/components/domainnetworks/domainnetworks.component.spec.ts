import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainnetworksComponent } from './domainnetworks.component';

describe('DomainnetworksComponent', () => {
  let component: DomainnetworksComponent;
  let fixture: ComponentFixture<DomainnetworksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainnetworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainnetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
