import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'am-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToVDSs() {
    this.router.navigate(['/vds-list']);
  }

  navigateToPhones() {
    this.router.navigate(['/phone-list']);
  }
}
