import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { Vds } from '../../shared/model/vds.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VdsService } from '../../shared/services/vds.service';
import { Subscription } from 'rxjs/Subscription';
import { SocialService } from '../../shared/services/social.service';
import { SocialAccount } from '../../shared/model/socilal-account.model';

@Component({
    selector: 'am-vds-card', 
    templateUrl: './vds-card.component.html', 
    styleUrls: ['./vds-card.component.css']
})
export class VdsCardComponent implements OnInit, OnDestroy {

    vds: Vds;
    baseDataIsLoaded = false;
    subscriptionBaseData: Subscription;

    accounts: SocialAccount[] = [];
    socialDtaIdLoaded = false;
    subscriptionSocialData: Subscription;

    constructor(private router: Router,
                private rote: ActivatedRoute,
                private vdsSrrvice: VdsService,
                private socialService: SocialService) {}

    ngOnInit() {
        this.loadVds();
        this.loadSocialAccounts();
        // this.subscriptionBaseData = this.rote.params
        //     .subscribe((params: Params) =>  {
        //         return this.vdsSrrvice.getVdsById(params['id'])
        //             .subscribe((vds: Vds) => {
        //                 this.vds = vds;
        //                 this.baseDataIsLoaded = true;
        //             });
        //     });

        // this.subscriptionSocialData = this.rote.params
        //     .subscribe((params: Params) =>  {
        //         return this.socialService.getSocialAccountsById(params['id'])
        //             .subscribe((acc: SocialAccount[]) => {
        //                 this.accounts = acc;
        //                 this.socialDtaIdLoaded = true;
        //             });
        //     });
    }

    private loadVds(): void {
        this.subscriptionBaseData = this.rote.params
            .subscribe((params: Params) =>  {
                return this.vdsSrrvice
                    .getVdsById(params['id'])
                    .subscribe((vds: Vds) => {
                        this.vds = vds;
                        this.baseDataIsLoaded = true;
                });
        });
    }

    private loadSocialAccounts(): void {
        this.subscriptionSocialData = this.rote.params
            .subscribe((params: Params) =>  {
                return this.socialService
                    .getSocialAccountsById(params['id'])
                    .subscribe((acc: SocialAccount[]) => {
                        this.accounts = acc;
                        this.socialDtaIdLoaded = true;
                });
        });
    }

    navToVdsList(): void {
        this.router.navigate(['vds-list'])
    }

    ngOnDestroy() {
        if (this.subscriptionBaseData) {
            this.subscriptionBaseData.unsubscribe();
        }
        if (this.subscriptionSocialData) {
            this.subscriptionSocialData.unsubscribe();
        }
    }
}
