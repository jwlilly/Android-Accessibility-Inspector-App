import { Component, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'find-in-page',
    templateUrl: './FindInPage.html'
  })

  export class FindInPage
  {
    @Output("parentFindInPage") parentFindInPage: EventEmitter<any> = new EventEmitter();
    @Output("parentStopFindInPage") parentStopFindInPage: EventEmitter<any> = new EventEmitter();
    @ViewChild('findInput') findInput:ElementRef | undefined;
    @ViewChild('findButton') findButton:ElementRef | undefined;

    findInPage(event: Event) {
        if(this.findInput instanceof ElementRef) {
            let find = this.findInput as ElementRef;
            if(find.nativeElement.value && find.nativeElement.value.length > 0) {
                this.parentFindInPage.emit({findText: find.nativeElement.value});
            }
        }
        setTimeout(() => {
            this.findButton?.nativeElement.focus();
        }, 1);
    }

    stopFindInPage() {
        this.parentStopFindInPage.emit();
        if(this.findInput instanceof ElementRef) {
            let find = this.findInput as ElementRef;
            find.nativeElement.value = "";
        }
    }
  }