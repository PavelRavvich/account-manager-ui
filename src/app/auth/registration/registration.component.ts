import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/auth.service';

@Component({
  selector: 'am-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  private formSubmitAttempt: boolean; // {2}
  form: FormGroup;                    // {1}

  constructor(private fb: FormBuilder,         // {3}
              private authService: AuthService // {4}
  ) {
  }

  ngOnInit() {
    console.log('!!!!!!!!');
    this.form = this.fb.group({     // {5}
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      dpassword: ['', [Validators.required, this.validateMatchPasswords.bind(this)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  validateMatchPasswords(control: FormControl) {
    // const err = this.form.get('password').value === this.form.get('dpassword').value;
    return {
      error: false
    };
  }

  onSubmit() {

  }

  isFieldInvalid(field: string) { // {6}
    if (field === 'dpassword') {
      return (!this.form.get(field).valid && this.form.get(field).touched) ||
        (this.form.get(field).untouched && this.formSubmitAttempt) ||
        (this.form.get('dpassword') !== this.form.get('password'));
    }

    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
}
