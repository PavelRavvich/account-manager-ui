import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/auth.service';

@Component({
  selector: 'am-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  passwordIsMatch = true;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      dpassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    this.passwordIsMatch = this.form.get('password').value === this.form.get('dpassword').value;
  }

  isFieldInvalid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
}
