import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { Phone } from '../shared/model/phone.model';
import { PhoneService } from '../shared/services/phone.service';
import { DialogPhoneComponent } from './dialog-phone/dialog-phone.component';
import { DialogConfirmationComponent } from '../shared/components/dialog-confirmation/dialog-confirmation.component';

@Component({
    selector: 'am-phones-list',
    templateUrl: './phones-list.component.html',
    styleUrls: ['./phones-list.component.css']
})
export class PhonesListComponent implements OnInit {
    /**
     * Phones data.
     */
    phonesIsLoaded = false;
    phones = new MatTableDataSource<Phone>([]);
    displayedColumns = [
        'id', 
        'number',
        'isActive', 
        'regDate', 
        'operator', 
        'site', 
        'operatorLogin', 
        'operatorPassword', 
        'socialAccountIds',
        'edit',
        'delete'
    ];
    /**
     * Pagination view.
     */
    paginator: MatPaginator;
    @ViewChild(MatPaginator)
    set appBacon(paginator : MatPaginator) {
        this.paginator = paginator;
        this.phones.paginator = this.paginator;
    }
    
    filterOpenState : boolean = false;
    filterForm : FormGroup;

    constructor(public dialog: MatDialog, 
                public snackBar: MatSnackBar,
                private phoneService: PhoneService) {
    }

    ngOnInit() {
        this.getPhoneList();
        this.updateFilterInstance();
    }

    /**
     * Applying all filters.
     */
    applyFilter(): void {
        this.filterById();
        this.filterByNumber();
        this.filterBySocialAccountId();
        this.filterByGSMOperator();
        this.filterByOperatorLogin();
        this.filterByOperatorPassword();
        this.filterByRegDate();
    }
    
    disableFilter(): void {
        this.getPhoneList();
        this.updateFilterInstance();
    }

    /**
     * Handle addition Phone event.
     */
    addPhone(): void {
        this.openAddDialog().afterClosed()
            .subscribe((formData: Phone) => {
                if (!!formData) {
                    const phone = new Phone(
                        formData.isActive,
                        formData.num,
                        formData.operatorType,
                        formData.operatorUrl,
                        formData.regDate,
                        [],
                        formData.operatorAccLogin,
                        formData.operatorAccPass
                    );
                    this.phoneService.addPhone(phone)
                        .subscribe((result: Phone) => this.getPhoneList());
                }
            });
    }

    /**
     * Open dialog window for addition new SocialAccount with corresponding form.
     */
    private openAddDialog(): MatDialogRef < DialogPhoneComponent > {
        return this.dialog.open(DialogPhoneComponent, { width: '33%', data: { isActive: 'Active', status: 'Active', regDate: new Date() } });
    }

    /**
     * Edit phone obj.
     * 
     * @param phone for eddition.
     */
    editPhone(phone: Phone) {
        this.dialog.open(
            DialogPhoneComponent, { 
                width: '33%', 
                data: { 
                    isActive: phone.isActive,
                    num: phone.num,
                    operatorType: phone.operatorType,
                    operatorUrl: phone.operatorUrl,
                    regDate: phone.regDate,
                    socialAccountIds: phone.socialAccountIds,
                    operatorAccLogin: phone.operatorAccLogin,
                    operatorAccPass: phone.operatorAccPass,
                    id: phone.id
                } 
            }).afterClosed().subscribe((updated: Phone) => {
                if (!!updated && (JSON.stringify(phone) !== JSON.stringify(updated))) {
                    updated.id = phone.id;
                    this.updatePhone(updated);
                }
            });
    }
    
    /**
     * Exchange old in memory obj Phone version to new version from backend.
     * 
     * @param phone starting state of Phone for edition.
     */
    private updatePhone(phone: Phone): void {
        this.phoneService.updatePhone(phone)
            .subscribe((dbVersion: Phone) => {
                const tmp = this.phones.data;
                const target = tmp.find(localVersion => dbVersion.id === localVersion.id);
                const index = tmp.indexOf(target);
                tmp[index] = dbVersion;
                this.phones = new MatTableDataSource(tmp);
            }, error => alert(error));
    }

    /**
     * Open dialog window for confirm or reject deleting Phone.
     * If user call confirm then call method @see#this.deletePhone(id);
     * 
     * @param id of deleting Phone.
     */
    openDialogDeletePhone(id: number): void {
        this.dialog.open(DialogConfirmationComponent, {
            width: '300px',
            data: {
                massage: `Phone number with ID: ${id} will be permanently deleted!`
            }
        }).afterClosed()
            .subscribe(confirmed => {
                if (!!confirmed) {
                    this.deletePhone(id);
                }
        });
    }

    private deletePhone(id: number): void {
        this.phoneService.deletePhone(id)
            .subscribe(data => {
                const snacConf = new MatSnackBarConfig();
                snacConf.duration = 10000;
                this.snackBar
                    .open(`Phone number with ID: ${id} has been deleted.`, 'OK', snacConf)
                    ._open();
                    this.getPhoneList();
            });
    }

    private filterById(): void {
        const { id } = this.filterForm.value;
        if (!!id && id !== '') {
            const data = this.phones.data.filter((phone: Phone) => id == phone.id);
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private filterByNumber(): void {
        const { num } = this.filterForm.value;
        if (!!num && num !== '') {
            const data = this.phones.data.filter((phone: Phone) => phone.num.indexOf(num) !== -1);
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private filterBySocialAccountId(): void {
        const { operator } = this.filterForm.value;
        if (!!operator && operator !== '') {
            const data = this.phones.data.filter((phone: Phone) => phone.operatorType.indexOf(operator) !== -1);
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private filterByGSMOperator(): void {
        const { socialAccId } = this.filterForm.value;
        if (!!socialAccId && socialAccId !== '') {
            const data = this.phones.data.filter((phone: Phone) => phone.socialAccountIds.indexOf(socialAccId) !== -1);
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private filterByOperatorLogin(): void {
        const { operatorAccLogin } = this.filterForm.value;
        if (!!operatorAccLogin && operatorAccLogin !== '') {
            const data = this.phones.data.filter((phone: Phone) => phone.operatorAccLogin.indexOf(operatorAccLogin) !== -1);
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private filterByOperatorPassword(): void {
        const { operatorAccPass } = this.filterForm.value;
        if (!!operatorAccPass && operatorAccPass !== '') {
            const data = this.phones.data.filter((phone: Phone) => phone.operatorAccPass.indexOf(operatorAccPass) !== -1);
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private filterByRegDate(): void {
        const { dateFrom, dateTo } = this.filterForm.value;
        if (!!dateFrom && !!dateTo) {
            const from = moment(dateFrom, 'MM-DD-YYYY');
            const to = moment(dateTo, 'MM-DD-YYYY');
            const data = this.phones.data.filter((phone: Phone) => {
                if (!phone.regDate) {
                    return false;
                }
                const regDate = moment(phone.regDate, 'YYYY-MM-DD')
                return regDate.isBetween(from, to, 'days', '[]');
            });
            this.phones = new MatTableDataSource<Phone>(data);
        }
    }

    private updateFilterInstance() : void {
        this.filterForm = new FormGroup({
            'id': new FormControl(null, []),
            'num': new FormControl(null, []),
            'dateFrom': new FormControl(null, []),
            'dateTo': new FormControl(null, []),
            'operator': new FormControl(null, []),
            'operatorAccLogin': new FormControl(null, []),
            'operatorAccPass': new FormControl(null, []),
            'socialAccId': new FormControl(null, []),
        });
    }

    private getPhoneList() {
        this.phoneService.getPhoneList()
            .subscribe((phones: Phone[]) => {
                this.phones = new MatTableDataSource<Phone>(phones.reverse());
                this.phonesIsLoaded = true;
            });
    }
}
