import {ActivatedRoute, Params} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../../shared/services/auth.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/model/user.model';

@Component({
    selector: 'am-login', 
    templateUrl: './login.component.html', 
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    form : FormGroup;
    userNotFound = false;
    isAccessDenied = false;

    constructor(private fb : FormBuilder, private authService : AuthService, private userService : UserService, private route : ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams
            .subscribe((params : Params) => {
                if (params['accessDenied']) {
                    this.isAccessDenied = true;
                }
            });

        this.form = this.fb.group({
                email: ['',[Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(5)]]
            });
    }

    isFieldInvalid(field : string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    onSubmit() {
        const formData = this.form.value;
        this.userService
            .getUserByEmail(formData.email)
            .subscribe((user : User) => {
                if (user !== undefined && user.password === formData.password) {
                    this.authService.login(this.form.value);
                } else {
                    this.userNotFound = true;
                }
            });
    }
}
