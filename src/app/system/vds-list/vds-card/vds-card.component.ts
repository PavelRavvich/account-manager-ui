import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Vds } from '../../shared/model/vds.model';
import { VdsService } from '../../shared/services/vds.service';
import { SocialService } from '../../shared/services/social.service';
import { SocialAccount } from '../../shared/model/socilal-account.model';
import { ClipboardService } from '../../shared/services/clipboard.service';
import { AddSocialComponent } from './add-social/add-social.component';

@Component({
    selector: 'am-vds-card', 
    templateUrl: './vds-card.component.html', 
    styleUrls: ['./vds-card.component.css']
})
export class VdsCardComponent implements OnInit, OnDestroy {

    /**
     * Base info about current VDS.
     */
    vds: Vds;
    baseDataIsLoaded = false;
    subscriptionBaseData: Subscription;

    /**
     * All social account attached to current VDS.
     */
    accounts: SocialAccount[] = [];
    socialDtaIdLoaded = false;
    subscriptionSocialData: Subscription;

    /**
     * Fields of dialog flow rod addition of new social account.
     */
    socialType: string;
    login: string;
    password: string;
    phone: string;
    notes: string;

    constructor(public dialog: MatDialog,
                private router: Router,
                private rote: ActivatedRoute,
                private vdsSrrvice: VdsService,
                private socialService: SocialService,
                private clipboardService: ClipboardService) {}

    ngOnInit() {
        this.loadVds();
        this.loadSocialAccounts();
    }

    openDialogAddSocial(): MatDialogRef < AddSocialComponent > {
        return this.dialog.open(AddSocialComponent, {
            width: '100%',
            data: { 
                socialType: this.socialType,
                login: this.login,
                password: this.password,
                phone: this.phone,
                notes: this.notes,
            }
        });
    }

    openDialog(): void {
        this.openDialogAddSocial()
            .afterClosed().subscribe(data => {
                if (!!data) {
                    this.socialService.addSocialAccount(
                        new SocialAccount(
                            this.vds.id, 
                            data.socialType, 
                            data.login, 
                            data.password, 
                            data.notes
                        )
                    ).subscribe((result: SocialAccount) => {
                        this.loadSocialAccounts();
                            console.log(result);
                        });
                }
        });
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
        this.socialDtaIdLoaded = false;
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
    copyToClipboard(text : string) : void {
        this.clipboardService.copyToClipboard(text);
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
