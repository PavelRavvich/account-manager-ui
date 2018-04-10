import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SystemComponent} from './system.component';
import {VdsListComponent} from './vds-list/vds-list.component';
import {PhonesListComponent} from './phones-list/phones-list.component';
import {AuthGuard} from '../shared/services/auth.guard';
import { VdsCardComponent } from './vds-list/vds-card/vds-card.component';
import { SocialAccountListComponent } from './social-account-list/social-account-list.component';

const routes : Routes = [
  {
    path: '',
    component: SystemComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'vds-list',
        component: VdsListComponent
      },
      {
        path: 'vds-list/:id',
        component: VdsCardComponent
      },
      {
        path: 'phone-list',
        component: PhonesListComponent
      },
      {
        path: 'social-account-list',
        component: SocialAccountListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}