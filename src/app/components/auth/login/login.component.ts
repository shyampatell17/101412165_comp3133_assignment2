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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      console.log('Submitting login form with:', { username });

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          let errorMessage = 'Login failed. Please try again.';
          
          if (error.networkError) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            errorMessage = error.graphQLErrors[0].message;
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
