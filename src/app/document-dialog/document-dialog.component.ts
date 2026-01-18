import { Component, Inject, inject, Input } from '@angular/core';
import { Document } from '../models/document.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { 
  MAT_DIALOG_DATA, 
  MatDialogRef, 
  MatDialogModule, 
  MatDialog
} from '@angular/material/dialog';

@Component({
  selector: 'app-document-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './document-dialog.component.html',
  styleUrl: './document-dialog.component.scss'
})
export class DocumentDialogComponent {
  constructor(
    // Receives the data passed from the parent
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private dialogRef: MatDialogRef<DocumentDialogComponent>
  ) {}

  signDocument() {
    console.log('Signing document:', this.data.id);
    // You might want to close and pass a result back:
    // this.dialogRef.close('signed');
  }

  deleteDocument() {
    console.log('Deleting document:', this.data.id);
    // this.dialogRef.close('deleted');
  }
}
