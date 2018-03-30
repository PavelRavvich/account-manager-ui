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
    vdsDataIsLoaded = false;
    private subscriptionVdsData: Subscription;

    /**
     * All social account attached to current VDS.
     */
    accounts: SocialAccount[] = [];
    socialDataIdLoaded = false;
    private subscriptionSocialData: Subscription;

    /**
     * Default constructor.
     * 
     * @param dialog a pop-up window with form for addition new SocialAccount and edit existed account.
     */
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

    /**
     * Handle addition SocialAccount event.
     */
    addSocialAccount(): void {
        this.openAddDialog().afterClosed().subscribe((formData: SocialAccount) => {
            if (!!formData) {
                const account = new SocialAccount(this.vds.id, formData.socialType, formData.login, formData.password, formData.notes)
                this.socialService.addSocialAccount(account).subscribe((result: SocialAccount) => this.loadSocialAccounts());
            }
        });
    }

    /**
     * Open dialog window for addition new SocialAccount with corresponding form.
     */
    private openAddDialog(): MatDialogRef < AddSocialComponent > {
        return this.dialog.open(AddSocialComponent, { width: '100%', data: { socialType: 'YouTube' } });
    }

    /**
     * Handle edition SocialAccount event.
     * 
     * @param account starting state of acc for edition.
     */
    editSocialAccount(account: SocialAccount): void {
        this.dialog.open(
            AddSocialComponent, { 
                width: '100%', 
                data: { 
                    id: account.id,
                    vdsId: account.vdsId,
                    socialType: account.socialType,
                    login: account.login,
                    password: account.password,
                    notes: account.notes
                } 
            }).afterClosed().subscribe((updated: SocialAccount) => {
                if (JSON.stringify(account) !== JSON.stringify(updated)) {
                    updated.id = account.id;
                    this.editAccount(updated);
                }
            });
    }

    /**
     * Exchange old in memory obj SocialAccount version to new version from backend.
     * 
     * @param account starting state of acc for edition.
     */
    private editAccount(account: SocialAccount): void {
        this.socialService.updateSocialAccount(account)
            .subscribe((dbVer: SocialAccount) => {
                const target = this.accounts.find(locVer => dbVer.id === locVer.id);
                const index = this.accounts.indexOf(target);
                this.accounts[index] = dbVer;
            }, error => alert(error));
    }

    /**
     * Loading basic data about VDS form bacend and filling corresponding field `this.vds`.
     */
    private loadVds(): void {
        this.subscriptionVdsData = this.rote.params
            .subscribe((params: Params) =>  {
                return this.vdsSrrvice
                    .getVdsById(params['id'])
                    .subscribe((vds: Vds) => {
                        this.vds = vds;
                        this.vdsDataIsLoaded = true;
                });
        });
    }

    /**
     * Loading data about SocialAccounts attached to current VDS form bacend and filling corresponding field `this.accounts`.
     */
    private loadSocialAccounts(): void {
        this.socialDataIdLoaded = false;
        this.subscriptionSocialData = this.rote.params
            .subscribe((params: Params) =>  {
                return this.socialService
                    .getSocialAccountsById(params['id'])
                    .subscribe((acc: SocialAccount[]) => {
                        this.accounts = acc;
                        this.socialDataIdLoaded = true;
                });
        });
    }

    /**
     * Go back to list of all VDS.
     */
    navToVdsList(): void {
        this.router.navigate(['vds-list'])
    }

    /**
     * Copy text to clipboard.
     * 
     * @param text for copying.
     */
    copyToClipboard(text : string) : void {
        this.clipboardService.copyToClipboard(text);
    }

    /**
     * Delete SocialAccount.
     * 
     * @param id of SocialAccount for deleting.
     */
    deleteAccount(id: number): void {
        this.socialService.deleteSocialAccount(id)
            .subscribe(data => this.loadSocialAccounts());
    }

    ngOnDestroy() {
        if (this.subscriptionVdsData) {
            this.subscriptionVdsData.unsubscribe();
        }
        if (this.subscriptionSocialData) {
            this.subscriptionSocialData.unsubscribe();
        }
    }
}
