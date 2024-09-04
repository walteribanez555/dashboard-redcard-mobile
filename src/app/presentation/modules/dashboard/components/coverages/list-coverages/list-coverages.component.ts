import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CoverageEntity } from '../../../../../../domain/entities/coverage.entity';
import { ItemListCoverageComponent } from '../item-list-coverage/item-list-coverage.component';
import { CoverageState } from '../../../../../../application/states/coverage/coverage.state';

@Component({
  selector: 'app-list-coverages',
  standalone: true,
  imports: [
    CommonModule,
    ItemListCoverageComponent,
  ],
  templateUrl : './list-coverages.component.html',
})
export class ListCoveragesComponent {

  @Input() coverages : CoverageEntity[] = [];


  @Output() onSelectCoverage = new EventEmitter<CoverageEntity>();

  onSelectTable( item : CoverageEntity) {
    this.onSelectCoverage.emit(item);
  }

 }
