import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { gql } from '@apollo/client/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}

interface SignupResponse {
  signup: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getCurrentUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  }

  login(username: string, password: string): Observable<User> {
    console.log('Login attempt with:', { username });
    
    const query = gql`
      query Login($input: LoginInput!) {
        login(input: $input) {
          user {
            id
            username
            email
            created_at
            updated_at
          }
          token
        }
      }
    `;

    const variables = {
      input: {
        username,
        password
      }
    };

    console.log('Sending GraphQL query:', query);
    console.log('With variables:', variables);

    return this.apollo.watchQuery<LoginResponse>({
      query,
      variables
    }).valueChanges.pipe(
      tap(result => {
        console.log('Login response:', result);
      }),
      map(result => {
        const { user, token } = result.data.login;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);
        }
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Login error details:', error);
        if (error.networkError) {
          console.error('Network error details:', error.networkError);
        }
        if (error.graphQLErrors) {
          console.error('GraphQL errors:', error.graphQLErrors);
        }
        return throwError(() => error);
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<User> {
    console.log('Signup attempt with:', { username, email });
    
    const mutation = gql`
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
          user {
            id
            username
            email
            created_at
            updated_at
          }
          token
        }
      }
    `;

    const variables = {
      input: {
        username,
        email,
        password
      }
    };

    console.log('Sending GraphQL mutation:', mutation);
    console.log('With variables:', variables);

    return this.apollo.mutate<SignupResponse>({
      mutation,
      variables
    }).pipe(
      tap(result => {
        console.log('Signup response:', result);
      }),
      map(result => {
        const { user, token } = result.data!.signup;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);
        }
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Signup error details:', error);
        if (error.networkError) {
          console.error('Network error details:', error.networkError);
        }
        if (error.graphQLErrors) {
          console.error('GraphQL errors:', error.graphQLErrors);
        }
        return throwError(() => error);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
