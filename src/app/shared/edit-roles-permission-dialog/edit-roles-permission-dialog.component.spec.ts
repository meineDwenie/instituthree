import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolesPermissionDialogComponent } from './edit-roles-permission-dialog.component';

describe('EditRolesPermissionDialogComponent', () => {
  let component: EditRolesPermissionDialogComponent;
  let fixture: ComponentFixture<EditRolesPermissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRolesPermissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRolesPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
