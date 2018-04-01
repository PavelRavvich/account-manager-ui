import {Component, OnInit, Input, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

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
    private subscriptionSocialData: Subscription;
    displayedColumns = ['id', 'socialType', 'regDate', 'status', 'phone', 'login', 'password', 'notes', 'edit', 'delete'];
    dataSource = new MatTableDataSource([]);
    socialAccountsIsLoaded = false;
    
    sort: MatSort;
    @ViewChild(MatSort)
    set appBacon(sort : MatSort) {
        this.sort = sort;
        this.dataSource.sort = this.sort;
    }

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
        this.openAddDialog().afterClosed()
            .subscribe((formData: SocialAccount) => {
                if (!!formData) {
                    const account = new SocialAccount(
                        this.vds.id, 
                        formData.socialType, 
                        formData.login, 
                        formData.password, 
                        formData.notes,
                        formData.phone,
                        moment(formData.regDate, 'YYYY-MM-DD').format('DD.MM.YYYY'), 
                        formData.status,
                        formData.id 
                    );
                    this.socialService.addSocialAccount(account)
                        .subscribe((result: SocialAccount) => this.loadSocialAccounts());
            }
        });
    }

    /**
     * Open dialog window for addition new SocialAccount with corresponding form.
     */
    private openAddDialog(): MatDialogRef < AddSocialComponent > {
        return this.dialog.open(AddSocialComponent, { width: '100%', data: { socialType: 'YouTube', status: 'Active', regDate: new Date() } });
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
                    login: account.login,
                    password: account.password,
                    socialType: account.socialType,
                    status: account.status,
                    phone: account.phone,
                    notes: account.notes,
                    regDate: new Date(moment(account.regDate, 'DD.MM.YYYY').format('MM/DD/YYYY'))
                } 
            }).afterClosed().subscribe((updated: SocialAccount) => {
                if (!!updated && (JSON.stringify(account) !== JSON.stringify(updated))) {
                    if (!!updated.regDate) {
                        updated.regDate = moment(new Date(updated.regDate)).format('DD.MM.YYYY')
                    }
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
            .subscribe((dbVersion: SocialAccount) => {
                const tmp = this.dataSource.data;
                const target = tmp.find(localVersion => dbVersion.id === localVersion.id);
                const index = tmp.indexOf(target);
                tmp[index] = dbVersion;
                this.dataSource = new MatTableDataSource(tmp);
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
        this.socialAccountsIsLoaded = false;
        this.subscriptionSocialData = this.rote.params
            .subscribe((params: Params) =>  {
                return this.socialService
                    .getSocialAccountsById(params['id'])
                    .subscribe((acc: SocialAccount[]) => {
                        this.dataSource = new MatTableDataSource(acc);
                        this.socialAccountsIsLoaded = true;
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
