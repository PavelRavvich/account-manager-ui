import {
    Component, 
    OnInit, 
    ViewChild,
    OnDestroy
} from '@angular/core';

import {
    MatPaginator, 
    MatTableDataSource, 
    MatDialogRef, 
    MatDialog, 
    MatSnackBarConfig, 
    MatSnackBar
} from '@angular/material';

import {
    FormControl, 
    FormGroup
} from '@angular/forms';

import * as moment from 'moment';
import { Router } from '@angular/router';

import { Vds } from '../shared/model/vds.model';
import { VdsService } from '../shared/services/vds.service';
import { ClipboardService } from '../shared/services/clipboard.service';
import { DialogAddVdsComponent } from './dialog-add-vds/dialog-add-vds.component';
import { Filters } from '../shared/filters/filters';
import { DialogConfirmationComponent } from '../shared/dialog/dialog-confirmation/dialog-confirmation.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
		selector: 'am-vds-list', 
		templateUrl: './vds-list.component.html', 
		styleUrls: ['./vds-list.component.css']
})
export class VdsListComponent implements OnInit, OnDestroy {
    subscribtions: Subscription[] = [];
    /**
     * Columns for display in data table.
     */
    displayedColumns = [
        'id',
        'ip',
        'login',
        'password',
        'startDate',
        'endDate',
        'detail',
        'delete'
    ];

    /**
     * Data of table representation.
     */
    dataSource : MatTableDataSource < Vds > = new MatTableDataSource([]);
    dataIsLoaded = false;
    
    /**
     * Include all FormConstrols in main filter group.
     */
    filterForm : FormGroup;

    /**
     * Open or close filter flag-switcher.
     */
    filterOpenState : boolean = false;

    /**
     * Pagination properties.
     */
    paginator : MatPaginator;
    @ViewChild(MatPaginator)
    set pagination(paginator : MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Filtering local data.
     */
    private filters: Filters = new Filters();

    /**
     * Default constructor.
     * 
     * @param clipboardService for interactive with clipboard.
     * @param vdsService move to backend for data.
     */
    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private clipboardService: ClipboardService,
                private vdsService : VdsService,
                private router: Router) {}

    ngOnInit() {
        this.refreshFilter();
        this.getVdsList();
    }

    /**
     * Create new filter instance instead old object.
     */
    private refreshFilter() : void {
        this.filterForm = new FormGroup({
            'ip': new FormControl(null, []),
            'id': new FormControl(null, []),
            'login': new FormControl(null, []),
            'password': new FormControl(null, []),
            'dateFrom': new FormControl(null, []),
            'dateTo': new FormControl(null, []),
            'dateBy': new FormControl('deactivatedDate', [])
        });
    }

    /**
     * Apply filter for local data.
     * Useing all FormConstrol with value not null. If value FormControl will be ignored.
     */
    applyFilter() : void {
        const {ip, id, login, password, dateFrom, dateTo, dateBy} = this.filterForm.value;
        this.dataSource = new MatTableDataSource(this.filters.doEqualFilter(this.dataSource.data, 'id', id));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'ip', ip));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'login', login));
        this.dataSource = new MatTableDataSource(this.filters.doIncludeFilter(this.dataSource.data, 'password', password));
        this.dataSource = new MatTableDataSource(
            dateBy === 'deactivatedDate' 
            ? this.filters.doFilterByDate(this.dataSource.data, 'deactivatedDate', dateFrom, dateTo) 
            : this.filters.doFilterByDate(this.dataSource.data, 'activatedDate', dateFrom, dateTo)
        );
    }

    /**
     * Update all dynamic data on page.
     */
    disableFilter() : void {
        this.getVdsList();
        this.refreshFilter();
    }

    /**
     * Copy text to clipboard buffer.
     * 
     * @param text for copy.
     */
    copyToClipboard(text : string) : void {
        this.clipboardService.copyToClipboard(text);
    }

    /**
     * Navigate to VDS ditails page.
     * 
     * @param id of Vds.
     */
    getDetail(id : number) {
        this.router.navigate(['vds-list', id.toString()]);
    }

    /**
     * Open dialog window for confirm or reject deleting VDS.
     * If user call confirm then call method @see#this.deleteVds(id);
     * 
     * @param id of deleting VDS.
     */
    openDialogDeleteVds(id: number): void {
        const sub = this.dialog.open(DialogConfirmationComponent, {
            width: '300px',
            data: {
                massage: `VDS with ID: ${id} will be permanently deleted!`
            }
        }).afterClosed()
            .subscribe(confirmed => {
                if (!!confirmed) {
                    this.deleteVds(id);
                }
        });
        this.subscribtions.push(sub);
    }

    /**
     * Delete VDS from server DB.
     * 
     * @param {number} id if VDS for delete.
     */
    private deleteVds(id: number): void {
        const sub =  this.vdsService.deleteVds(id)
            .subscribe(data => {
                const snacConf = new MatSnackBarConfig();
                snacConf.duration = 10000;
                this.snackBar
                    .open(`VDS with ID: ${id} has been deleted.`, 'OK', snacConf)
                    ._open();
                this.getVdsList();
            });
            this.subscribtions.push(sub);
    }

    /**
     * Handle addition VDS event.
     */
    addVds(): void {
        const sub =  this.openAddDialog().afterClosed()
            .subscribe((formData: Vds) => {
                if (!!formData) {
                    const vds = new Vds(
                        formData.ip,
                        formData.login,
                        formData.password,
                        formData.activatedDate,
                        formData.deactivatedDate
                    );
                    const sub1 = this.vdsService.addVds(vds)
                        .subscribe((result: Vds) => this.getVdsList());
                        this.subscribtions.push(sub1);
            }
        });
        this.subscribtions.push(sub);
    }
    
    /**
     * Open dialog window for addition new VDS with corresponding form.
     */
    private openAddDialog(): MatDialogRef < DialogAddVdsComponent > {
        return this.dialog.open(
            DialogAddVdsComponent, 
            { 
                width: '33%', 
                data: { 
                    activatedDate: new Date(),
                    deactivatedDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
                } 
            }
        );
    }

    /**
     * Pull VDS list from server.
     */
    private getVdsList() : void {
        const sub = this.vdsService.getVdsList()
            .subscribe((data: Vds[]) => {
                this.dataSource = new MatTableDataSource(data);
                this.dataIsLoaded = true;
            });
            this.subscribtions.push(sub);
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
