import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { AuthService } from '../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'gender', 'designation', 'salary', 'department', 'actions'];
  dataSource: Employee[] = [];
  searchForm: FormGroup;
  departments: string[] = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations'
  ];
  positions: string[] = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator'];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      department: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.dataSource = employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load employees. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  searchEmployees(): void {
    this.isLoading = true;
    const searchParams = {
      department: this.searchForm.get('department')?.value || undefined
    };
    
    this.employeeService.searchEmployees(searchParams).subscribe({
      next: (employees) => {
        this.dataSource = employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching employees:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to search employees. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees/details', id]);
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.isLoading = true;
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
          this.snackBar.open('Employee deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to delete employee. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
