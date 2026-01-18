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
import { Router } from '@angular/router';

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
  private router = inject(Router);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private dialogRef: MatDialogRef<DocumentDialogComponent>
  ) {}

  signDocument() {
    this.router.navigate([`/sign/${this.data.id}`]);
    this.dialogRef.close();
  }

  deleteDocument() {
  }
}
