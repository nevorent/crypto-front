import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Document } from '../models/document.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-document-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './document-selector-dialog.component.html',
  styleUrl: './document-selector-dialog.component.scss'
})
export class DocumentSelectorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public documents: Document[],
    private dialogRef: MatDialogRef<DocumentSelectorDialogComponent>
  ) {}

  selectDocument(doc: Document) {
    this.dialogRef.close(doc.id);
  }

  close() {
    this.dialogRef.close();
  }
}
