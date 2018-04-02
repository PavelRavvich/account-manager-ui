import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/common.module';
import {AppRoutingModule} from '../app-routing.module';
import {CommonModule} from '@angular/common';
import {SystemComponent} from './system.component';
import {VdsListComponent} from './vds-list/vds-list.component';
import {PhonesListComponent} from './phones-list/phones-list.component';
import {VdsService} from './shared/services/vds.service';
import {VdsCardComponent} from './vds-list/vds-card/vds-card.component';
import {SocialService} from './shared/services/social.service';
import {ClipboardService} from './shared/services/clipboard.service';
import {PhoneService} from './shared/services/phone.service';
import { DialogSocialAcc } from './vds-list/vds-card/dialog-social-acc/dialog-social-acc.component';

@NgModule({
    declarations: [
        SystemComponent, 
        VdsListComponent, 
        PhonesListComponent, 
        VdsCardComponent, 
        DialogSocialAcc
    ],
    imports: [
        SharedModule, 
        CommonModule, 
        AppRoutingModule
    ],
    providers: [
        VdsService, 
        SocialService, 
        ClipboardService, 
        PhoneService
    ],
    entryComponents: [
        DialogSocialAcc
    ]
})
export class SystemModule {}