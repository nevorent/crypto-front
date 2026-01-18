import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSelectorDialogComponent } from './document-selector-dialog.component';

describe('DocumentSelectorDialogComponent', () => {
  let component: DocumentSelectorDialogComponent;
  let fixture: ComponentFixture<DocumentSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
