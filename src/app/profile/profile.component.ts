import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner/spinner.service';
import { Document } from '../models/document.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentDialogComponent } from '../document-dialog/document-dialog.component';
import { DocumentService } from '../services/document/document.service';
import { IdentityDialogComponent } from '../identity-dialog/identity-dialog.component';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatDividerModule,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private documentService = inject(DocumentService);
  private spinnerService = inject(SpinnerService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private user?: User;
  protected documents: Document[] = [];

  ngOnInit(): void {
    this.spinnerService.show();
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      this.spinnerService.hide();
      return;
    }
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      this.documentService.getDocuments().subscribe((docs) => {
        this.documents = docs;
        this.spinnerService.hide();
      });
    });
  }

  public get username() {
    return this.user?.username;
  }

  public get email() {
    return this.user?.email;
  }

  public get isActive() {
    return this.user?.isActive;
  }

  public get createdAt() {
    return this.user?.createdAt;
  }

  openDocumentDetails(doc: Document) {
    const dialogRef = this.dialog.open(DocumentDialogComponent, {
      width: '450px',
      data: doc,
      autoFocus: false 
    });
    dialogRef.afterClosed().subscribe((documentId) => {
      this.documents = this.documents.filter((doc) => doc.id != documentId);
    });
  }

  triggerFileSelect() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
      input.value = ''; 
    }
  }

  uploadFile(file: File) {
    this.documentService.uploadDocument(file).subscribe({
      next: (uploadedDoc) => {
        console.log('Upload Success:', uploadedDoc);
        this.documents.push(uploadedDoc);
      },
      error: (err) => {
        console.error('Upload Failed', err);
      }
    });
  }

  openIdentityDialog() {
    const dialogRef = this.dialog.open(IdentityDialogComponent, {
      width: '450px',
      autoFocus: false 
    });

    dialogRef.afterClosed().subscribe((tuple: {keySize: number, keyPassword: string}) => {
      this.spinnerService.show();
      if (tuple.keySize) {
        this.authService.regenerateIdentity(tuple.keySize, tuple.keyPassword).subscribe({
          next: (result) => {
            if (result) {
              this.snackBar.open('Identity regeneration was successful!', 'Dismiss', { duration: 3000 });
            }
            this.spinnerService.hide();
          },
          error: (err) => {
            this.snackBar.open('An error occurred during identity regeneration. Please try again.', 'Dismiss',{ duration: 4000 });
            this.spinnerService.hide();
          }
        })
      }
    });
  }
}
