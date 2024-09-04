import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoverageEntity } from '../../../../../../domain/entities/coverage.entity';

@Component({
  selector: '[item-list-coverage]',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl : './item-list-coverage.component.html',

})
export class ItemListCoverageComponent {

  @Input() coverage! :CoverageEntity;

 }
