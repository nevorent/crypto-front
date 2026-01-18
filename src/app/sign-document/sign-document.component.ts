import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { PaddingEnum } from './padding-enum';

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
  protected password: string = '';
  protected hidePassword: boolean = true;

  @ViewChild('keyInput') keyInput!: ElementRef<HTMLInputElement>;

  documentId: string | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  privateKeyFile?: File;
  privateKeyFileName?: string;
  
  paddingMode: string = PaddingEnum.PKCS; 
  paddingOptions = [ PaddingEnum.PKCS, PaddingEnum.PSS ];

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
        this.snackBar.open('Failed to load PDF: ' + err, 'Dismiss');
        this.spinnerService.hide();
      }
    });
  }

  signDocument() {
    this.spinnerService.show();
    if (this.documentId && this.privateKeyFile &&  this.password && this.paddingMode) {
      this.documentService.signDocument(Number.parseInt(this.documentId), this.privateKeyFile, this.password, this.paddingMode).subscribe({
        next: (signResponse) => {
          this.spinnerService.hide();
          this.snackBar.open(signResponse.message, 'Dismiss', { duration: 3000 }).afterDismissed().subscribe(() => {
            this.router.navigate(['/profile']);
          });
        },
        error: (err) => {
          this.snackBar.open('There was an error signing the document. Please try again later.', 'Dismiss', { duration: 4000 });
          this.spinnerService.hide();
        }
      });
    }
  }

  triggerKeyUpload() {
    this.keyInput.nativeElement.click();
  }

  onKeySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.privateKeyFile = input.files[0];
      this.privateKeyFileName = this.privateKeyFile.name;
    }
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
