import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DetailListener } from '../../../interfaces/Detail.listener';
import { DiscountEntity } from '../../../../../../domain/entities/discount.entity';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fetchImageAsFile } from '../../../../shared/utils/images';
import { MultipleFileInputComponent } from '../../../../shared/components/custom-inputs/multiple-file-input/multiple-file-input.component';
import { ItemList } from '../../../../shared/components/item-list/interfaces/ItemList.interfaces';
import { SelectComponent } from "../../../../shared/components/custom-inputs/select/select.component";

@Component({
  selector: 'app-detail-discount',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultipleFileInputComponent,
    SelectComponent
],
  templateUrl : './detail-discount.component.html',
})
export class DetailDiscountComponent {


  items: ItemList[] = [
    {
      id: 1,
      name: 'Porcentual',
    },
    {
      id: 2,
      name: 'Fijo',
    },
  ];


  async ngAfterViewInit(): Promise<void> {
    const files = this.discountEntity.imagesUrl;




    const filesConverted = await Promise.all(
      files.map((file) => fetchImageAsFile(file, file.split('/').pop() || ''))
    );

    this.discountForm= new FormGroup({
      id: new FormControl(this.discountEntity.discount_id),
      title: new FormControl(this.discountEntity.title),
      description: new FormControl(this.discountEntity.description),
      amount : new FormControl(this.discountEntity.amount),
      type: new FormControl(this.discountEntity.type),
      previousFiles : new FormControl(files),
      files: new FormControl(filesConverted),
    });
  }


  ngOnInit(): void {}

  @Input() detailListener!: DetailListener<DiscountEntity>;
  @Input() discountEntity!: DiscountEntity;

  discountForm = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
    description: new FormControl(),
    previousFiles : new FormControl(),
    amount : new FormControl(),
    type: new FormControl(),
    files: new FormControl(),
  });

  close() {
    this.detailListener.close();
  }

  onSubmit() {
    this.detailListener.submit(this.discountForm);
  }

  onDelete( ) {
    this.detailListener.delete(this.discountEntity);
  }
 }
