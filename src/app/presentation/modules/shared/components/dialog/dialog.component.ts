import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';
import { interval, Observable, timer } from 'rxjs';
import { DialogPosition } from '../../enum/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  styleUrls: ['./dialog.component.css'],
  templateUrl: './dialog.component.html',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          visibility: 'visible',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      transition('open => closed', [animate('0.3s')]),
      transition('closed => open', [animate('0.1s')]),
    ]),
  ],
})
export class DialogComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private iconRegistry: SvgIconRegistryService
  ) {}

  ngOnInit(): void {
    this.notifierFromParent?.subscribe({
      next: (resp) => {
        this.onSubmit();
      },
      error: (err) => {
        this.onSubmit();
      },
      complete: () => {
        this.close();
      },
    });

    this.timer$.subscribe((resp) => {
      this.isOpen = true;
      this.cdr.detectChanges();
    });

    this.timerClose$?.subscribe((resp) => {
      this.isOpen = false;
      this.cdr.detectChanges();
      this.onSubmit();
    });
  }

  @Input() title?: string = 'Agregado correctamente';
  @Input() description?: string = '';
  @Input() iconUrl?: string = 'assets/icons/heroicons/outline/check-badge.svg';
  @Input() colorIcon?: string = 'text-green-700';
  @Input() withBackground?: boolean = false;
  @Input() notifierFromParent?: Observable<any>;

  private cdr = inject(ChangeDetectorRef);

  @Input() position?: DialogPosition[] = [
    DialogPosition.bottom,
    DialogPosition.right,
  ];

  @Input() withActions?: boolean = true;

  @Input() isOpen = false;

  @Input() timer$ = timer(100);

  @Input() timerClose$: Observable<0> | null = null;

  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();
  @Output()  cancelEvent = new EventEmitter();

  changeState() {
    const actualState = this.isOpen;
    this.isOpen = !actualState;
  }

  onSubmit() {
    this.isOpen = false;

    this.elementRef.nativeElement.remove();
    this.submitEvent.emit();
  }

  close() {
    this.isOpen = false;

    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }


  onCancel () {
    this.isOpen = false;

    this.elementRef.nativeElement.remove();
    this.cancelEvent.emit();
  }
}
