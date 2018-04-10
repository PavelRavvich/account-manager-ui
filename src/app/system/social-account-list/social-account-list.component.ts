import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog, MatSnackBarConfig } from '@angular/material';
import { SocialAccount } from '../shared/model/socilal-account.model';
import { SocialService } from '../shared/services/social.service';
import { ClipboardService } from '../shared/services/clipboard.service';
import * as moment from 'moment';
import { DialogSocialAcc } from '../vds-list/vds-card/dialog-social-acc/dialog-social-acc.component';
import { DialogConfirmationComponent } from '../shared/components/dialog-confirmation/dialog-confirmation.component';

@Component({
    selector: 'am-social-account-list', 
    templateUrl: './social-account-list.component.html', 
    styleUrls: ['./social-account-list.component.css']
})
export class SocialAccountListComponent implements OnInit {
    displayedColumns = [
        'id',
        'socialType',
        'status',
        'phone',
        'login',
        'password',
        'regDate',
        'vdsId',
        'notes',
        'edit',
        'delete'
    ];
    /**
     * Data of table representation.
     */
    dataSource : MatTableDataSource < SocialAccount > = new MatTableDataSource([]);
    dataIsLoaded = false;
    /**
     * State of filter's accordion.
     */
    filterOpenState = false;

    /**
     * Include all FormConstrols in main filter group.
     */
    filterForm : FormGroup;
    
    /**
     * Pagination properties.
     */
    paginator : MatPaginator;
    @ViewChild(MatPaginator)
    set pagination(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private socialService: SocialService,
                private clipboardService: ClipboardService) {}

    ngOnInit() {
        this.refreshFilter();
        this.getSocialAccounts();
    }

    /**
     * Create new filter instance instead old object.
     */
    private refreshFilter() : void {
        this.filterForm = new FormGroup({
            'id': new FormControl(null, []),
            'socialType': new FormControl(null, []),
            'status': new FormControl(null, []),
            'phone': new FormControl(null, []),
            'login': new FormControl(null, []),
            'password': new FormControl(null, []),
            'notes': new FormControl(null, []),
            'unused': new FormControl(false, []),
            'dateFrom': new FormControl(null, []),
            'dateTo': new FormControl(null, [])
        });
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
                    this.socialService.addSocialAccount(formData)
                        .subscribe((result: SocialAccount) => this.getSocialAccounts());
                }
        });
    }

    applyFilter() {
        this.filterById();
        this.filterByLogin();
        this.filterByPhone();
        this.filterByNotes();
        this.filterByStatus();
        this.filterByUnused();
        this.filterByRegDate();
        this.filterByPassword();
        this.filterBySocialType();
    }

    disableFilter() {
        this.getSocialAccounts();
        this.refreshFilter();
    }

    copyToClipboard(id: number) {
        this.clipboardService.copyToClipboard(id + '');
    }

    openEditDialogSocialAccount(account: SocialAccount) {
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
                this.getSocialAccounts();
            });
    }

    private getSocialAccounts() {
        this.socialService.getSocialAccounts().subscribe((accounts: SocialAccount[]) => {
            this.dataSource = new MatTableDataSource(accounts);
            this.dataIsLoaded = true;
        });
    }

    private filterBySocialType(): void {
        if (!!this.filterForm.value.socialType) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.socialType === this.filterForm.value.socialType);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterById(): void {
        if (!!this.filterForm.value.id) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.id === +this.filterForm.value.id);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByStatus(): void {
        if (!!this.filterForm.value.status) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.status === this.filterForm.value.status);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByPhone(): void {
        if (!!this.filterForm.value.phone) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.phone.indexOf(this.filterForm.value.phone) !== -1);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByLogin(): void {
        if (!!this.filterForm.value.login) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.login.indexOf(this.filterForm.value.login) !== -1);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByPassword(): void {
        if (!!this.filterForm.value.password) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.password.indexOf(this.filterForm.value.password) !== -1);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByNotes(): void {
        if (!!this.filterForm.value.notes) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => account.notes.indexOf(this.filterForm.value.notes) !== -1);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByUnused(): void {
        if (this.filterForm.value.unused) {
            const result = this.dataSource.data
                .filter((account: SocialAccount) => !account.vdsId);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByRegDate(): void {
        if (!!this.filterForm.value.dateFrom && !!this.filterForm.value.dateTo) {
            const from = moment(this.filterForm.value.dateFrom, 'MM-DD-YYYY');
            const to = moment(this.filterForm.value.dateTo, 'MM-DD-YYYY');
            const result = this.dataSource.data.filter((account: SocialAccount) => {
                return moment(account.regDate, 'YYYY-MM-DD').isBetween(from, to, 'days' ,'[]');
            });
            this.dataSource = new MatTableDataSource(result);
        }
    }
}
