import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="employee-details-container">
      <mat-card *ngIf="employee" class="employee-card">
        <mat-card-header>
          <mat-card-title>Employee Details</mat-card-title>
          <mat-card-subtitle>{{employee.first_name}} {{employee.last_name}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="profile-section" *ngIf="employee.employee_photo">
            <img [src]="employee.employee_photo" alt="Employee photo" class="profile-photo">
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <h3>Personal Information</h3>
              <p><strong>First Name:</strong> {{employee.first_name}}</p>
              <p><strong>Last Name:</strong> {{employee.last_name}}</p>
              <p><strong>Email:</strong> {{employee.email}}</p>
              <p><strong>Gender:</strong> {{employee.gender}}</p>
            </div>

            <div class="detail-item">
              <h3>Employment Information</h3>
              <p><strong>Department:</strong> {{employee.department}}</p>
              <p><strong>Designation:</strong> {{employee.designation}}</p>
              <p><strong>Salary:</strong> {{employee.salary | currency}}</p>
              <p><strong>Date of Joining:</strong> {{employee.date_of_joining | date}}</p>
            </div>

            <div class="detail-item">
              <h3>System Information</h3>
              <p><strong>Employee ID:</strong> {{employee.id}}</p>
              <p><strong>Created:</strong> {{employee.created_at | date:'medium'}}</p>
              <p><strong>Last Updated:</strong> {{employee.updated_at | date:'medium'}}</p>
            </div>
          </div>
        </mat-card-content>

        <mat-divider></mat-divider>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="editEmployee()">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-raised-button color="warn" (click)="deleteEmployee()">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="isLoading" class="loading-spinner">
        Loading...
      </div>
    </div>
  `,
  styles: [`
    .employee-details-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .employee-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      margin-bottom: 2rem;
    }

    mat-card-title {
      font-size: 24px;
      color: #333;
      margin-bottom: 0.5rem;
    }

    mat-card-subtitle {
      font-size: 18px;
      color: #666;
    }

    .profile-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-photo {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #3f51b5;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .detail-item h3 {
      color: #3f51b5;
      margin-bottom: 1rem;
      font-size: 18px;
      font-weight: 500;
    }

    .detail-item p {
      margin: 0.5rem 0;
      color: #444;
    }

    .detail-item strong {
      color: #333;
      font-weight: 500;
    }

    mat-card-actions {
      padding: 1rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-size: 1.2rem;
      color: #666;
    }
  `]
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.snackBar.open('Error loading employee details', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/employees/edit', this.employee.id]);
    }
  }

  deleteEmployee(): void {
    if (this.employee && confirm('Are you sure you want to delete this employee?')) {
      this.isLoading = true;
      this.employeeService.deleteEmployee(this.employee.id).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.snackBar.open('Error deleting employee', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
} 