import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Vds} from '../shared/model/vds.model';

@Component({
  selector: 'am-vds-list',
  templateUrl: './vds-list.component.html',
  styleUrls: ['./vds-list.component.css']
})
export class VdsListComponent implements AfterViewInit {

  displayedColumns = ['id', 'ip', 'password', 'startDate', 'endDate', 'detail'];
  dataSource: MatTableDataSource<Vds>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    // Create 100 users
    const vdsArr: Vds[] = [];
    for (let i = 1; i <= 100; i++) {
      const vds = new Vds('172.169.0.3.5', 'Administrator', 'asse4Kh', '12/23/87', '11/23/19', i);
      vdsArr.push(vds);
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(vdsArr);
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilterByIp(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getDetail(id: number) {
    console.log(id);
  }
}



