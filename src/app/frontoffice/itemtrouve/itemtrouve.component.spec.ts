import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemtrouveComponent } from './itemtrouve.component';

describe('ItemtrouveComponent', () => {
  let component: ItemtrouveComponent;
  let fixture: ComponentFixture<ItemtrouveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemtrouveComponent]
    });
    fixture = TestBed.createComponent(ItemtrouveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
