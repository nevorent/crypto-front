import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../services/document/document.service';
import { SpinnerService } from '../services/spinner/spinner.service';

@Component({
  selector: 'app-sign-document',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './sign-document.component.html',
  styleUrl: './sign-document.component.scss'
})
export class SignDocumentComponent implements OnInit, OnDestroy{
  private documentService = inject(DocumentService);
  private spinnerService = inject(SpinnerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private snackBar = inject(MatSnackBar);

  private objectUrl?: string;

  documentId: string | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  
  paddingMode: string = 'PKCS1'; 
  paddingOptions = ['PKCS1', 'PSS', 'OAEP'];

  ngOnInit() {
    this.documentId = this.route.snapshot.paramMap.get('id');

    if (this.documentId) {
      this.loadDocument(this.documentId);
    }
  }

  private loadDocument(id: string) {
    this.spinnerService.show();
    this.documentService.getDocumentContent(Number.parseInt(id)).subscribe({
      next: (blob: Blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        this.objectUrl = URL.createObjectURL(file);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
        this.spinnerService.hide();
      },
      error: (err) => {
        this.snackBar.open('Failed to load PDF: ' + err, 'Disminss');
        this.spinnerService.hide();
      }
    });
  }

  signDocument() {
  }

  cancel() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }
}
