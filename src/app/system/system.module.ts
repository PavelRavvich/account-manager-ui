import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/common.module';
import {AppRoutingModule} from '../app-routing.module';
import {CommonModule} from '@angular/common';
import {SystemComponent} from './system.component';
import {VdsListComponent} from './vds-list/vds-list.component';
import {PhonesListComponent} from './phones-list/phones-list.component';
import {VdsService} from './shared/services/vds.service';
import { VdsCardComponent } from './vds-list/vds-card/vds-card.component';

@NgModule({
    declarations: [
        SystemComponent, VdsListComponent, PhonesListComponent, VdsCardComponent
    ],
    imports: [
        SharedModule, CommonModule, AppRoutingModule
    ],
    providers: [VdsService]
})
export class SystemModule {}