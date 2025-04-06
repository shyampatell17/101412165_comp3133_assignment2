import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

interface GetEmployeesResponse {
  getAllEmployees: Employee[];
}

interface SearchEmployeesResponse {
  searchEmployees: Employee[];
}

interface GetEmployeeResponse {
  getEmployeeById: Employee;
}

interface CreateEmployeeResponse {
  createEmployee: Employee;
}

interface UpdateEmployeeResponse {
  updateEmployee: Employee;
}

interface DeleteEmployeeResponse {
  deleteEmployee: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      authorization: token ? `Bearer ${token}` : ''
    };
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<GetEmployeesResponse>({
      query: gql`
        query GetAllEmployees {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
          }
        }
      `,
      context: {
        headers: this.getHeaders()
      }
    }).valueChanges.pipe(
      map(result => result.data.getAllEmployees)
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.watchQuery<GetEmployeeResponse>({
      query: gql`
        query GetEmployeeById($id: ID!) {
          getEmployeeById(id: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
          }
        }
      `,
      variables: { id },
      context: {
        headers: this.getHeaders()
      }
    }).valueChanges.pipe(
      map(result => result.data.getEmployeeById)
    );
  }

  createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Observable<Employee> {
    return this.apollo.mutate<CreateEmployeeResponse>({
      mutation: gql`
        mutation CreateEmployee($input: EmployeeInput!) {
          createEmployee(input: $input) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
          }
        }
      `,
      variables: { input: employee },
      context: {
        headers: this.getHeaders()
      }
    }).pipe(
      map(result => result.data!.createEmployee)
    );
  }

  updateEmployee(id: string, employee: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>): Observable<Employee> {
    return this.apollo.mutate<UpdateEmployeeResponse>({
      mutation: gql`
        mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
          updateEmployee(id: $id, input: $input) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
          }
        }
      `,
      variables: { id, input: employee },
      context: {
        headers: this.getHeaders()
      }
    }).pipe(
      map(result => result.data!.updateEmployee)
    );
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo.mutate<DeleteEmployeeResponse>({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id },
      context: {
        headers: this.getHeaders()
      }
    }).pipe(
      map(result => result.data!.deleteEmployee)
    );
  }

  searchEmployees(searchParams: { department?: string }): Observable<Employee[]> {
    return this.apollo.watchQuery<SearchEmployeesResponse>({
      query: gql`
        query SearchEmployees($department: String) {
          searchEmployees(department: $department) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
          }
        }
      `,
      variables: searchParams,
      context: {
        headers: this.getHeaders()
      }
    }).valueChanges.pipe(
      map(result => result.data.searchEmployees)
    );
  }
}
