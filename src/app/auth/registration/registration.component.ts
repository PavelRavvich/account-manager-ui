import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/model/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'am-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  passwordIsMatch = true;
  emailIsUnique = true;
  regSuccess = false;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (!(this.passwordIsMatch = (this.form.get('password').value === this.form.get('confirmPassword').value))) {
      return;
    }
    this.userService.getUserByEmail(this.form.value.email)
      .subscribe((user: User) => {
        this.emailIsUnique = user === undefined;
      });
    if (this.emailIsUnique) {
      const email = this.form.value.email;
      const password = this.form.value.password;
      const username = this.form.value.username;
      const newUser = new User(email, password, username);
      this.userService.post('users', newUser)
        .subscribe((u: User) => {
          this.regSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        });
    }
  }

  isFieldInvalid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
}
