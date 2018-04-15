import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'am-dialog-confirmation', 
    templateUrl: './dialog-confirmation.component.html', 
    styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent {

    massage: string;

    constructor(public dialogRef : MatDialogRef < DialogConfirmationComponent >, 
                @Inject(MAT_DIALOG_DATA)public data : any) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
