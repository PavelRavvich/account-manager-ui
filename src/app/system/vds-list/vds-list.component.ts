import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as moment from 'moment';

import {Vds} from '../shared/model/vds.model';
import {FormControl, FormGroup} from '@angular/forms';
import {VdsService} from '../shared/services/vds.service';

@Component({
  selector: 'am-vds-list',
  templateUrl: './vds-list.component.html',
  styleUrls: ['./vds-list.component.css']
})
export class VdsListComponent implements OnInit {
  displayedColumns = [
    'id',
    'ip',
    'password',
    'startDate',
    'endDate',
    'detail'
  ];
  dataSource: MatTableDataSource<Vds> = new MatTableDataSource([]);
  filterForm: FormGroup;
  dataIsLoaded = false;

  paginator: MatPaginator;

  @ViewChild(MatPaginator)
  set appBacon(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSource.paginator = this.paginator;
  }

  constructor(private vdsService: VdsService) {
  }

  ngOnInit() {
    this.updateFilterInstance();
    this.getDataFromServer();
  }

  applyFilter(): void {
    const {ip, id} = this.filterForm.value;
    this.filterByDate();
    this.filterById(id);
    this.filterByIp(ip);
  }

  disableFilter(): void {
    this.getDataFromServer();
    this.updateFilterInstance();
  }

  private filterByDate(): void {
    const {dateFrom, dateTo, byActivate} = this.filterForm.value;
    if (!!dateFrom && dateFrom.length !== 0 && !!dateTo && dateTo.length !== 0) {
      this.dataSource.data = (byActivate === 'activate') ?
        this.filterActivateBetween(dateFrom, dateTo) :
        this.filterDeactivateBetween(dateFrom, dateTo);
    }
  }

  private filterActivateBetween(dateFilterFrom: string, dateFilterTo: string): Vds[] {
    const filterFrom = moment(dateFilterFrom);
    const filterTo = moment(dateFilterTo);
    return this.dataSource.data.filter((vds: Vds) => {
      const activate = moment(vds.activatedDate, 'DD.MM.YYYY');
      return activate.isBetween(filterFrom, filterTo);
    });
  }
  
  private filterDeactivateBetween(dateFilterFrom: string, dateFilterTo: string): Vds[] {
    const filterFrom = moment(dateFilterFrom);
    const filterTo = moment(dateFilterTo);
    return this.dataSource.data.filter((vds: Vds) => {
      const activate = moment(vds.deactivatedDate, 'DD.MM.YYYY');
      return activate.isBetween(filterFrom, filterTo);
    });
  }

  private filterById(id: string): void {
    if (!!id && id !== '') {
      this.dataSource.data = this.dataSource.data.filter((vds: Vds) => id === (vds.id + ''));
    }
  }

  private filterByIp(ip: string): void {
    if (!!ip && ip !== '') {
      console.log('ip');
      this.dataSource.data = this.dataSource.data
        .filter((vds: Vds) => vds.ip.indexOf(ip) !== -1);
    }
  }

  private getDataFromServer(): void {
    this.vdsService.getVds().subscribe((vds: Vds[]) => {
      this.dataSource = new MatTableDataSource(vds);
      this.dataIsLoaded = true;
    });
  }

  private updateFilterInstance(): void {
    this.filterForm = new FormGroup({
      'ip': new FormControl(null, []),
      'id': new FormControl(null, []),
      'dateFrom': new FormControl(null, []),
      'dateTo': new FormControl(null, []),
      'byActivate': new FormControl('activate', [])
    });
  }

  getDetail(id: number) {
    console.log(id);
  }
}



