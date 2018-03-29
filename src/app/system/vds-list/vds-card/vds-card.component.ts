import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { Vds } from '../../shared/model/vds.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VdsService } from '../../shared/services/vds.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'am-vds-card', 
    templateUrl: './vds-card.component.html', 
    styleUrls: ['./vds-card.component.css']
})
export class VdsCardComponent implements OnInit, OnDestroy {

    vds: Vds;
    dataIsLaded = false;
    subscription: Subscription;

    constructor(private router: Router,
                private rote: ActivatedRoute,
                private vdsSrrvice: VdsService) {}

    ngOnInit() {
        this.subscription = this.rote.params
            .subscribe((params: Params) =>  {
                return this.vdsSrrvice.getVdsById(params['id'])
                    .subscribe((vds: Vds) => {
                        this.vds = vds;
                        this.dataIsLaded = true;
                    });
            });
    }

    navToVdsList(): void {
        this.router.navigate(['vds-list'])
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
