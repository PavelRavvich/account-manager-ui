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
    this.fillDataSource();
  }

  applyFilter() {
    const {ip, id} = this.filterForm.value;
    this.filterByDate();
    this.filterById(id);
    this.filterByIp(ip);
    console.log(this.dataSource.data);
  }

  disableFilter() {
    this.fillDataSource();
    this.updateFilterInstance();
  }

  private filterByDate() {
    const {dateFrom, dateTo, byActivate} = this.filterForm.value;
    if (!!dateFrom && dateFrom.length !== 0 && !!dateTo && dateTo.length !== 0) {
      this.dataSource.data = (byActivate === 'activate') ?
        this.filterActivateBetween(dateFrom, dateTo) :
        this.filterDeactivateBetween(dateFrom, dateTo);
    }
  }

  private filterActivateBetween(dateFilterFrom: string, dateFilterTo: string) {
    const filterFrom = moment(dateFilterFrom);
    const filterTo = moment(dateFilterTo);
    return this.dataSource.data.filter((vds: Vds) => {
      const activate = moment(vds.activatedDate, 'DD.MM.YYYY');
      return activate.isBetween(filterFrom, filterTo);
    });
  }

  private filterDeactivateBetween(dateFilterFrom: string, dateFilterTo: string) {
    const filterFrom = moment(dateFilterFrom);
    const filterTo = moment(dateFilterTo);
    return this.dataSource.data.filter((vds: Vds) => {
      const activate = moment(vds.deactivatedDate, 'DD.MM.YYYY');
      return activate.isBetween(filterFrom, filterTo);
    });
  }

  private filterById(id: string): void {
    if (!!id && id !== '') {
      this.dataSource.data = [this.dataSource.data.find((vds: Vds) => (vds.id + '') === id)];
    }
  }

  private filterByIp(ip: string): void {
    this.dataSource.data = this.dataSource.data
      .filter((vds: Vds) => vds.ip.indexOf(ip) !== -1);
  }

  private fillDataSource() {
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



