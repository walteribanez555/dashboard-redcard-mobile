import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalContent } from '../../../../shared/models/modal-content';
import { ActionModalListener } from '../../../../shared/interfaces/ActionModalListener';
import { DynamicForm } from '../../../../shared/types/dynamic.types';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './notification-form.component.html',
})
export class NotificationFormComponent implements ModalContent, AfterViewInit {
  @Input() forms!: DynamicForm[] | null;
  actionsModal?: ActionModalListener | undefined;
  onCreateModal?: EventEmitter<any> | undefined;
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  form: FormGroup | null = null;

  // nft : Nft= {
  //   id: 34356771,
  //   title: 'Girls of the Cartoon Universe',
  //   creator: 'Jhon Doe',
  //   instant_price: 4.2,
  //   price: 187.47,
  //   ending_in: '06h 52m 47s',
  //   last_bid: 0.12,
  //   image: './assets/images/img-01.jpg',
  //   avatar: './assets/avatars/avt-01.jpg',
  // };
  @Input() data!: any;



}
