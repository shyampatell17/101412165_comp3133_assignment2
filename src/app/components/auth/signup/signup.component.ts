import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.signupForm.value;
      console.log('Submitting signup form with:', { username, email });

      this.authService.signup(username, email, password).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          this.snackBar.open('Account created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup error:', error);
          this.isLoading = false;
          let errorMessage = 'Error creating account. Please try again.';
          
          if (error.networkError) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            errorMessage = error.graphQLErrors[0].message;
          }
          
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
