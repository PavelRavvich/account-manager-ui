import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'am-add-social',
    templateUrl: './add-social.component.html',
    styleUrls: ['./add-social.component.css']
})
export class AddSocialComponent {

    selectedDefaultSocialType = 'YouTube';

    constructor(public dialogRef: MatDialogRef<AddSocialComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
