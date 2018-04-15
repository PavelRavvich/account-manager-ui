import {
    Input, 
    OnInit, 
    Component, 
    OnDestroy, 
    ViewChild
} from '@angular/core';
import { 
    ActivatedRoute, 
    Params, 
    Router 
} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { 
    MatSort, 
    MatDialog, 
    MatDialogRef, 
    MatSnackBarConfig, 
    MatTableDataSource,
    MatSnackBar 
} from '@angular/material';
import { DialogAddVdsComponent } from '../dialog-add-vds/dialog-add-vds.component';
import * as moment from 'moment';

import { ClipboardService } from '../../shared/services/clipboard.service';
import { SocialAccount } from '../../shared/model/socilal-account.model';
import { SocialService } from '../../shared/services/social.service';
import { VdsService } from '../../shared/services/vds.service';
import { Vds } from '../../shared/model/vds.model';
import { DialogConfirmationComponent } from '../../shared/dialog/dialog-confirmation/dialog-confirmation.component';
import { DialogSocialAcc } from '../../shared/dialog/dialog-social-acc/dialog-social-acc.component';

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
    displayedColumns = [
        'id', 
        'socialType', 
        'regDate', 
        'status', 
        'phone', 
        'login', 
        'password', 
        'notes', 
        'edit', 
        'delete'
    ];
    dataSource = new MatTableDataSource([]);
    socialAccountsIsLoaded = false;
    
    sort: MatSort;
    @ViewChild(MatSort)
    set sorter(sort : MatSort) {
        this.sort = sort;
        this.dataSource.sort = this.sort;
    }

    /**
     * Default constructor.
     * 
     * @param dialog a pop-up window with form for addition new SocialAccount and edit existed account.
     */
    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
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
        this.dialog
            .open(
                DialogSocialAcc, { 
                    width: '33%', 
                    data: { 
                        socialType: 'YouTube', 
                        status: 'Active', 
                        regDate: new Date() 
                    } 
                })
            .afterClosed()
            .subscribe((formData: SocialAccount) => {
                if (!!formData) {
                    formData.vdsId = this.vds.id;
                    this.socialService.addSocialAccount(formData)
                        .subscribe((result: SocialAccount) => this.loadSocialAccounts());
                }
        });
    }

    /**
     * Edit current VDS.
     */
    openEditVdsDialog(): void {
        this.dialog.open(DialogAddVdsComponent, {
            width: '33%',
            data: {
                ip: this.vds.ip,
                login: this.vds.login,
                password: this.vds.password,
                activatedDate: this.vds.activatedDate,
                deactivatedDate: this.vds.deactivatedDate,
                id: this.vds.id
            }
        }).afterClosed().subscribe((formData: Vds) => {
            if (!!formData) {
                this.vdsSrrvice.updateVds(formData)
                    .subscribe((vds: Vds) => this.vds = vds);
            }        
        });
    }

    /**
     * Delete current VDS from DB.
     */
    openDialogDeleteVds(): void {
        this.dialog.open(DialogConfirmationComponent, {
            width: '300px',
            data: {
                massage: `This VDS with IP: ${this.vds.ip} will be permanently deleted!`
            }
        }).afterClosed()
            .subscribe(confirmed => {
                if (!!confirmed) {
                    this.vdsSrrvice.deleteVds(this.vds.id).subscribe((data => {
                        this.router.navigate(['vds-list']);
                    }));
                }
        });
    }

    /**
     * Handle edition SocialAccount event.
     * 
     * @param account starting state of acc for edition.
     */
    editSocialAccount(account: SocialAccount): void {
        this.dialog.open(
            DialogSocialAcc, { 
                width: '33%', 
                data: { 
                    id: account.id,
                    vdsId: account.vdsId,
                    login: account.login,
                    password: account.password,
                    socialType: account.socialType,
                    status: account.status,
                    phone: account.phone,
                    notes: account.notes,
                    regDate: account.regDate
                } 
            }).afterClosed().subscribe((result: SocialAccount) => {
                if (!!result && (JSON.stringify(account) !== JSON.stringify(result))) {
                    result.id = account.id;
                    this.editAccount(result);
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
                        this.dataSource = new MatTableDataSource(acc.reverse());
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
     * Open dialog window for confirm or reject deleting Social Account.
     * If user call confirm then call method @see#this.deleteSocialAccount(id);
     * 
     * @param id of deleting Social Account.
     */
    openDialogDeleteSocialAccount(id: number): void {
        this.dialog.open(DialogConfirmationComponent, {
            width: '300px',
            data: {
                massage: `Social Account with ID: ${id} will be permanently deleted!`
            }
        }).afterClosed()
            .subscribe(confirmed => {
                if (!!confirmed) {
                    this.deleteSocialAccount(id);
                }
        });
    }

    private deleteSocialAccount(id: number): void {
        this.socialService.deleteSocialAccount(id)
            .subscribe(data => {
                const snacConf = new MatSnackBarConfig();
                snacConf.duration = 10000;
                this.snackBar
                    .open(`Social Account with ID: ${id} has been deleted.`, 'OK', snacConf)
                    ._open();
                this.loadSocialAccounts();
            });
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
