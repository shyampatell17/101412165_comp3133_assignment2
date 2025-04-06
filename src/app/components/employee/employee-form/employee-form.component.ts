import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  isLoading = false;

  departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations'
  ];

  genders = ['Male', 'Female', 'Other'];

  designations = [
    'Software Engineer',
    'Senior Developer',
    'Project Manager',
    'Product Manager',
    'Marketing Manager',
    'Sales Representative',
    'HR Manager',
    'Financial Analyst'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      date_of_joining: ['', [Validators.required]],
      department: ['', [Validators.required]],
      employee_photo: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining,
          department: employee.department,
          employee_photo: employee.employee_photo
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.snackBar.open('Error loading employee', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const employeeData = this.employeeForm.value;

      // Convert salary to number
      employeeData.salary = Number(employeeData.salary);

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
          next: () => {
            this.snackBar.open('Employee updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.snackBar.open('Error updating employee', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.snackBar.open('Employee created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Error creating employee:', error);
            this.snackBar.open('Error creating employee', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
