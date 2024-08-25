import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector, Type } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { Dialog } from '../models/dialog';
import { ModalComponent } from '../components/modal/modal.component';
import { DialogPosition, DialogType } from '../enum/dialog';


@Injectable({
  providedIn: 'root'
})
export class DialogService {


  private dialogNotifier? : Subject<any>;

  onOpen = timer(1000);

  constructor(
    private resolver : ComponentFactoryResolver,
    private injector : Injector,
    @Inject(DOCUMENT) private document : Document
  ) { }

  open( dialog : Dialog  ){

    const dialogComponentFactory =
      this.resolver.resolveComponentFactory(DialogComponent);


    const dialogComponentRef = dialogComponentFactory.create(this.injector);

    const dialogComponent = dialogComponentRef.instance;


    if(dialog.typeDialog) {
      // dialogComponent.position = [DialogPosition.center];

      switch(dialog.typeDialog) {
        case DialogType.isAlert:
          dialogComponent.iconUrl = 'assets/icons/heroicons/outline/exclamation.svg';
          dialogComponent.colorIcon = "text-orange-500";
          break;

        case DialogType.isSuccess:
          dialogComponent.iconUrl = 'assets/icons/heroicons/outline/check-badge.svg';
          dialogComponent.colorIcon = "text-green-700";
          break;


        case DialogType.isLoading :
          dialogComponent.iconUrl = 'assets/icons/loading.svg';
          dialogComponent.colorIcon = "text-primary";
          break;

        case DialogType.isError:

          dialogComponent.iconUrl = 'assets/icons/heroicons/outline/exclamation.svg';
          dialogComponent.colorIcon = "text-red-500";
          break;
      }


    }else {
    }

    if( dialog.options ) {
      dialogComponent.position = dialog.options.position;
      dialogComponent.withActions = dialog.options.withActions;
      dialogComponent.timerClose$ = dialog.options.timeToShow ? dialog.options.timeToShow : null;
      dialogComponent.withBackground = dialog.options.withBackground;
      dialogComponent.colorIcon = dialog.options.colorIcon;

    }

    if( dialog.data ) {
      dialogComponent.title = dialog.data.title;
      dialogComponent.description = dialog.data.description;
      dialogComponent.iconUrl = dialog.data.icon;

    }


    if( dialog.listener ) {
      dialogComponent.notifierFromParent = dialog.listener;
    }


    dialogComponent.closeEvent.subscribe(() => {
      this.closeDialog();
    }),


    dialogComponent.submitEvent.subscribe( ( ) => {
      this.submitDialog();
    })

    dialogComponent.cancelEvent.subscribe( ( ) => {

    })


    this.onOpen.subscribe(() => {
      dialogComponentRef.hostView.detectChanges();
      dialogComponent.isOpen = true;
    })


    this.document.body.appendChild(dialogComponentRef.location.nativeElement);
    dialogComponentRef.hostView.detectChanges();



    this.dialogNotifier = new Subject();

    return this.dialogNotifier.asObservable();
  }

  closeDialog() {
    this.dialogNotifier?.complete();
  }

  submitDialog( ) {
    this.dialogNotifier?.next(null);
    this.closeDialog();
  }

  cancelDialog( ) {
    this.dialogNotifier?.error(null);
    this.closeDialog();
  }

}
