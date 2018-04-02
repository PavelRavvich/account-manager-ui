import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogSocialAcc} from '../vds-card/dialog-social-acc/dialog-social-acc.component';
import {SocialAccount} from '../../shared/model/socilal-account.model';
import { Vds } from '../../shared/model/vds.model';

@Component({
    selector: 'am-dialog-add-vds', 
    templateUrl: './dialog-add-vds.component.html', 
    styleUrls: ['./dialog-add-vds.component.css']
})
export class DialogAddVdsComponent {
    /**
     * Default constructor.
     *
     * @param dialogRef injecting througth `entryComponents: [DialogAddVdsComponent]` see system.module.ts
     * @param data injecting througth MatDialog.open(`data`).MatDialogRef.openAddDialog().afterClosed().
     */
    constructor(public dialogRef : MatDialogRef < DialogAddVdsComponent >, 
                @Inject(MAT_DIALOG_DATA)public data : Vds) {}

    onNoClick() : void {
        this.dialogRef.close();
    }

}
