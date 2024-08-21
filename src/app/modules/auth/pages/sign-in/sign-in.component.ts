import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../../core/services/api/auth/auth.service';
import { IntentLogin } from '../../../../core/models/IntentLogin';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AngularSvgIconModule,
    NgClass,
    NgIf,
    ButtonComponent,
  ],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  private authService = inject(AuthService);

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.isAuth();

    this.form = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const intentLogin: IntentLogin = {
      username: email,
      password,
    };

    this.authService.login(intentLogin).subscribe({
      next: (resp) => {
        this._router.navigate(['/']);
      },
      error: (err) => {},
      complete: () => {},
    });
  }


  isAuth() {
    const authorization = localStorage.getItem('Authorization');
    if(!authorization){
      return;
    }

    if(authorization !== "ExternalUser902010" ){
      this._router.navigate(['/']);
    }
  }
}
