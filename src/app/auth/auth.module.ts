import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/common.module';
import {AppRoutingModule} from '../app-routing.module';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from './auth.component';
import {RegistrationComponent} from './registration/registration.component';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        AuthComponent, 
        LoginComponent, 
        RegistrationComponent
    ],
    imports: [SharedModule, 
        CommonModule, 
        AppRoutingModule
    ]
})
export class AuthModule {}