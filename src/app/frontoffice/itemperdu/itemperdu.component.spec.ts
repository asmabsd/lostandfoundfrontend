import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemperduComponent } from './itemperdu.component';

describe('ItemperduComponent', () => {
  let component: ItemperduComponent;
  let fixture: ComponentFixture<ItemperduComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemperduComponent]
    });
    fixture = TestBed.createComponent(ItemperduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
