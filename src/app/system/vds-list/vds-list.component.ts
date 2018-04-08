import {
    Component, 
    OnInit, 
    ViewChild
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

import {Vds} from '../shared/model/vds.model';
import {VdsService} from '../shared/services/vds.service';
import { ClipboardService } from '../shared/services/clipboard.service';
import { DialogAddVdsComponent } from './dialog-add-vds/dialog-add-vds.component';
import { DialogConfirmationComponent } from '../shared/components/dialog-confirmation/dialog-confirmation.component';

@Component({
		selector: 'am-vds-list', 
		templateUrl: './vds-list.component.html', 
		styleUrls: ['./vds-list.component.css']
})
export class VdsListComponent implements OnInit {
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
    set appBacon(paginator : MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

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
                private router: Router,) {}

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
            'dateFrom': new FormControl(null, []),
            'dateTo': new FormControl(null, []),
            'dateBy': new FormControl('endDate', [])
        });
    }

    /**
     * Apply filter.
     * Useing all FormConstrol with value not null. If value FormControl will be ignored.
     */
    applyFilter() : void {
        const {ip, id} = this.filterForm.value;
        this.filterByDate();
        this.filterById(id);
        this.filterByIp(ip);
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
        this.dialog.open(DialogConfirmationComponent, {
            width: '300px',
            data: {
                massage: `VDS with ID: ${id} will be permanently deleted!`
            }
        }).afterClosed()
            .subscribe(confirmed => {
                debugger;
                if (!!confirmed) {
                    this.deleteVds(id);
                }
        });
    }

    private deleteVds(id: number): void {
        this.vdsService.deleteVds(id)
            .subscribe(data => {
                const snacConf = new MatSnackBarConfig();
                snacConf.duration = 10000;
                this.snackBar
                    .open(`VDS with ID: ${id} has been deleted.`, 'OK', snacConf)
                    ._open();
                this.getVdsList();
            });
    }

    /**
     * Handle addition VDS event.
     */
    addVds(): void {
        this.openAddDialog().afterClosed()
            .subscribe((formData: Vds) => {
                if (!!formData) {
                    const vds = new Vds(
                        formData.ip,
                        formData.login,
                        formData.password,
                        formData.activatedDate,
                        formData.deactivatedDate
                    );
                    this.vdsService.addVds(vds)
                        .subscribe((result: Vds) => this.getVdsList());
            }
        });
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
    
    private filterByDate() : void {
        const {dateFrom, dateTo, dateBy} = this.filterForm.value;
        if (!dateFrom || !dateTo) {
            return;
        }
        const filteredData: Vds[] = (dateBy === 'endDate' 
            ? this.filterByEndDate() : this.filterByStartDate());

        this.dataSource = new MatTableDataSource(filteredData);
    }
    
    private filterByEndDate(): Vds[] {
        const {dateFrom, dateTo} = this.filterForm.value;
        const from = moment(dateFrom, 'MM-DD-YYYY');
        const to = moment(dateTo, 'MM-DD-YYYY');
        return this.dataSource
            .data.filter((vds: Vds) => {
                const deactivated = moment(vds.deactivatedDate, 'YYYY-MM-DD');
                return deactivated.isBetween(from, to, 'days', '[]');
            });
    }

    private filterByStartDate(): Vds[] {
        const {dateFrom, dateTo} = this.filterForm.value;
        const from = moment(dateFrom, 'MM-DD-YYYY');
        const to = moment(dateTo, 'MM-DD-YYYY');
        return this.dataSource
            .data.filter((vds: Vds) => {
                const activated = moment(vds.activatedDate, 'YYYY-MM-DD');
                return activated.isBetween(from, to, 'days', '[]');
            });
    }

    private filterById(id : string) : void {
        if(!!id && id !== '') {
            const result = this.dataSource.data
                .filter((vds : Vds) => id === (vds.id + ''));
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private filterByIp(ip : string) : void {
        if(!!ip && ip !== '') {
            const result = this.dataSource.data
                .filter((vds : Vds) => vds.ip.indexOf(ip) !== -1);
            this.dataSource = new MatTableDataSource(result);
        }
    }

    private getVdsList() : void {
        this.vdsService.getVdsList()
            .subscribe((vds : Vds[]) => {
                this.dataSource = new MatTableDataSource(vds);
                this.dataIsLoaded = true;
            });
    }
}
