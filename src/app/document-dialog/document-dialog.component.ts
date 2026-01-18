import { Component, Inject, inject } from '@angular/core';
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
import { DocumentService } from '../services/document/document.service';
import { SpinnerService } from '../services/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private documentService = inject(DocumentService);
  private spinnerService = inject(SpinnerService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private dialogRef: MatDialogRef<DocumentDialogComponent>
  ) {}

  signDocument() {
    this.router.navigate([`/sign/${this.data.id}`]);
    this.dialogRef.close();
  }

  deleteDocument() {
    this.spinnerService.show();
    this.documentService.deleteDocument(this.data.id).subscribe({
      next: (result) => {
        this.snackBar.open(result.message, 'Dismiss', { duration: 3000 });
        this.spinnerService.hide();
        this.dialogRef.close(this.data.id);
      },
      error: (err) => {
        this.snackBar.open('An error occurred during identity regeneration. Please try again.', 'Dismiss',{ duration: 4000 });
        this.spinnerService.hide();
      }
    })

  }
}
