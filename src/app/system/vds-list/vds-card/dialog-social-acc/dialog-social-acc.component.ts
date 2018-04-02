import { Component, OnInit, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SocialAccount } from '../../../shared/model/socilal-account.model';

@Component({
    selector: 'am-dialog-social-acc',
    templateUrl: './dialog-social-acc.component.html',
    styleUrls: ['./dialog-social-acc.component.css']
})
export class DialogSocialAcc {
    /**
     * Default constructor.
     * 
     * @param dialogRef injecting througth `entryComponents: [AddSocialComponent]` see system.module.ts
     * @param data injecting througth MatDialog.open(`data`).MatDialogRef.openAddDialog().afterClosed() see vds-card.component.
     */
    constructor(public dialogRef: MatDialogRef<DialogSocialAcc>,
                @Inject(MAT_DIALOG_DATA) public data: SocialAccount) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
