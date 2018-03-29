import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SharedModule} from './shared/common.module';
import {AuthModule} from './auth/auth.module';
import {AuthRoutingModule} from './auth/auth-routing.module';
import {AuthService} from './shared/services/auth.service';
import {UserService} from './shared/services/user.service';
import {SystemModule} from './system/system.module';
import {SystemRoutingModule} from './system/system-routing.module';
import {AuthGuard} from './shared/services/auth.guard';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        AuthModule,
        SystemModule,
        AuthRoutingModule,
        SystemRoutingModule
    ],
    providers: [
        AuthService, 
        UserService, 
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}