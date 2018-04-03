import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Phone} from '../../shared/model/phone.model';

@Component({
    selector: 'am-dialog-phone', 
    templateUrl: './dialog-phone.component.html', 
    styleUrls: ['./dialog-phone.component.css']
})
export class DialogPhoneComponent {
    /**
     * Default constructor.
     *
     * @param dialogRef injecting througth `entryComponents: [AddSocialComponent]` see system.module.ts
     * @param data injecting througth MatDialog.open(`data`).MatDialogRef.openAddDialog().afterClosed() see vds-card.component.
     */
    constructor(public dialogRef : MatDialogRef < DialogPhoneComponent >, 
                @Inject(MAT_DIALOG_DATA)public data : Phone) {}

    onNoClick() : void {
        this.dialogRef.close();
    }

}
