import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { NotificationFormComponent } from '../notification-form/notification-form.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { ModalService } from '../../../../shared/services/Modal.service';
import { ActionType } from '../../../../shared/enum/action';

@Component({
  selector: 'app-notification-menu',
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule],
  templateUrl: './notification-menu.component.html',
  styleUrl: './notification-menu.component.scss',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        })
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class NotificationMenuComponent {
  public isOpen = false;

  private modalService = inject(ModalService);

  contentForm = new FormGroup({});

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  actualDate() {
    //formatear para obtener formato con 01 en vez de 1 en la hora minuto y segundos, solo obtener la hora
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  onClickNotification() {
    // const notification = {
    //   title: 'Nuevo Pedido',
    //   description: 'Se ha creado un nuevo pedido',
    //   date: this.actualDate(),
    //   icon: 'assets/icons/heroicons/outline/plus.svg',
    // };

    // this.modalService
    //   .open(NotificationFormComponent, {
    //     title: `Ingresar tus api keys`,
    //       size: 'sm',
    //       forms: null,
    //       data: {},
    //       icon: 'assets/icons/heroicons/outline/plus.svg',
    //       actions: [
    //         {
    //           action: ActionType.Create,
    //           title: 'Ingresar',
    //         },
    //       ],
    //   })
    //   .subscribe({
    //     next: (content: any) => {
    //       console.log({ content });
    //     },
    //     error: (err) => {},
    //     complete: () => {},
    //   });
  }
}
