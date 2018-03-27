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
  dataSource: MatTableDataSource<Vds>;
  filterForm: FormGroup;
  dataIsLoded = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
      this.dataIsLoded = true;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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



