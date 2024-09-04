import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild, ElementRef, inject } from '@angular/core';
import { ModalContent } from '../../models/modal-content';
import { DynamicForm } from '../../types/dynamic.types';
import * as QRCode from 'qrcode'; // Asegúrate de que esta importación es correcta

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeComponent implements ModalContent, AfterViewInit {
  @Input() forms: DynamicForm[] = [];
  @Input() data: any;

  @ViewChild('qrQuote') qrQuoteCanvas?: ElementRef<HTMLCanvasElement>;

  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    const dataQr = this.data.qr;
    const element = this.qrQuoteCanvas?.nativeElement;

    console.log({ dataQr });

    if (element) {
      QRCode.toCanvas(element, dataQr, (err) => {
        if (err) {
          console.log(err);
        } else {
          this.cdr.detectChanges();
        }
      });
    }
  }
}
