import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog, MatSnackBarConfig } from '@angular/material';
import { SocialAccount } from '../shared/model/socilal-account.model';
import { SocialService } from '../shared/services/social.service';
import { ClipboardService } from '../shared/services/clipboard.service';
import * as moment from 'moment';
import { DialogConfirmationComponent } from '../shared/dialog/dialog-confirmation/dialog-confirmation.component';
import { Filters } from '../shared/filters/filters';
import { DialogSocialAcc } from '../shared/dialog/dialog-social-acc/dialog-social-acc.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'am-social-account-list', 
    templateUrl: './social-account-list.component.html', 
    styleUrls: ['./social-account-list.component.css']
})
export class SocialAccountListComponent implements OnInit, OnDestroy {
    
    subscribtions: Subscription[] = [];

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
    filters: Filters = new Filters();

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

    /**
     * Apply all activated filter fields.
     */
    applyFilter() {
        const {id, login, password, phone, notes, status, socialType, dateFrom, dateTo, unused} = this.filterForm.value;
        this.dataSource = new MatTableDataSource(this.filters.doEqualFilter(this.dataSource.data, 'id', id));
        this.dataSource = new MatTableDataSource(this.filters.doEqualFilter(this.dataSource.data, 'status', status));
        this.dataSource = new MatTableDataSource(this.filters.doEqualFilter(this.dataSource.data, 'socialType', socialType));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'login', login));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'password', password));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'notes', notes));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'phone', phone));        
        this.dataSource = new MatTableDataSource(this.filters.doFilterByDate(this.dataSource.data, 'regDate', dateFrom, dateTo));
        this.dataSource = unused ?  new MatTableDataSource(this.filters.doFilterByEmptyField(this.dataSource.data, 'vdsId')) : this.dataSource;
    }

    disableFilter() {
        this.getSocialAccounts();
        this.refreshFilter();
    }


    /**
     * Edit account.
     */
    openEditDialogSocialAccount(account: SocialAccount) {
        const oldVersion = JSON.parse(JSON.stringify(account));
        const sub = this.dialog.open(DialogSocialAcc, { width: '33%', data: account })
            .afterClosed().subscribe((result: SocialAccount) => {
                if (!!result && JSON.stringify(oldVersion) !== JSON.stringify(result)) {
                    this.editAccount(result);
                }
            });
            this.subscribtions.push(sub);
    }

    /**
     * Exchange old in memory obj SocialAccount version to new version from backend.
     * 
     * @param account starting state of acc for edition.
     */
    private editAccount(account: SocialAccount): void {
        const sub = this.socialService.updateSocialAccount(account)
            .subscribe((dbVersion: SocialAccount) => {
                const tmp = this.dataSource.data;
                const target = tmp.find(localVersion => dbVersion.id === localVersion.id);
                const index = tmp.indexOf(target);
                tmp[index] = dbVersion;
                this.dataSource = new MatTableDataSource(tmp);
            }, error => alert(error));
            this.subscribtions.push(sub);
    }

    /**
     * Open dialog window for confirm or reject deleting Social Account.
     * If user call confirm then call method @see#this.deleteSocialAccount(id);
     * 
     * @param id of deleting Social Account.
     */
    openDialogDeleteSocialAccount(id: number): void {
        const sub = this.dialog.open(DialogConfirmationComponent, {
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
        this.subscribtions.push(sub);
    }

    /**
     * Deleting Social account from database.
     * 
     * @param {number} id of SocialAccount for deleting.
     */
    private deleteSocialAccount(id: number): void {
        const sub = this.socialService.deleteSocialAccount(id)
            .subscribe(data => {
                const snacConf = new MatSnackBarConfig();
                snacConf.duration = 10000;
                this.snackBar
                    .open(`Social Account with ID: ${id} has been deleted.`, 'OK', snacConf)
                    ._open();
                this.getSocialAccounts();
            });
            this.subscribtions.push(sub);
    }

    private getSocialAccounts() {
        const sub = this.socialService.getSocialAccounts().subscribe((accounts: SocialAccount[]) => {
            this.dataSource = new MatTableDataSource(accounts);
            this.dataIsLoaded = true;
        });
        this.subscribtions.push(sub);
    }

    copyToClipboard(id: number) {
        this.clipboardService.copyToClipboard(id + '');
    }

    /**
     * Ubsubscribing for optimization.
     */
    ngOnDestroy(): void {
        if (!!this.subscribtions) {
            this.subscribtions.forEach(sub => {
                if (!!sub) {
                    sub.unsubscribe();
                }
            });
        }
    }
}
