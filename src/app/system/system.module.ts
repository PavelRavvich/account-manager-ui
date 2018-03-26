import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/common.module';
import {AppRoutingModule} from '../app-routing.module';
import {CommonModule} from '@angular/common';
import { SystemComponent } from './system.component';
import { VdsListComponent } from './vds-list/vds-list.component';
import { PhonesListComponent } from './phones-list/phones-list.component';

@NgModule({
  declarations: [
    SystemComponent,
    VdsListComponent,
    PhonesListComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AppRoutingModule
  ]
})
export class SystemModule {
}
