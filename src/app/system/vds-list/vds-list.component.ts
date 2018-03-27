import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
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
    this.filterForm = new FormGroup({
      'ip': new FormControl(null, []),
      'id': new FormControl(null, []),
      'dateFrom': new FormControl(null, []),
      'dateTo': new FormControl(null, [])
    });

    this.vdsService.getVds().subscribe((vds: Vds[]) => {
      this.dataSource = new MatTableDataSource(vds);
      this.dataIsLoaded = true;
    });
  }

  applyFilter() {
    console.log(this.filterForm);
  }

  disableFilter() {
    console.log(this.filterForm);
  }

  getDetail(id: number) {
    console.log(id);
  }
}



