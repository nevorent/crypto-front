import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-identity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './identity-dialog.component.html',
  styleUrl: './identity-dialog.component.scss'
})
export class IdentityDialogComponent {
  protected selectedKeySize: number = 2048;
  protected keySizes: number[] = [1024, 2048, 4096];

  constructor(
    private dialogRef: MatDialogRef<IdentityDialogComponent>
  ) {}

  regenerate() {
    this.dialogRef.close(this.selectedKeySize);
  }

  cancel() {
    this.dialogRef.close();
  }
}
