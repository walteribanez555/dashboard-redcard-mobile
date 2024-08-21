import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DetailListener } from '../../../interfaces/Detail.listener';
import { Link } from '../../../models/link.model';
import { ItemList } from '../../../../shared/components/item-list/interfaces/ItemList.interfaces';
import { SelectComponent } from '../../../../shared/components/custom-inputs/select/select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LinkUI } from '../../../models/ui/link-ui.model';

@Component({
  selector: 'app-link-detail',
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl : './link-detail.component.html',
})
export class LinkDetailComponent implements OnInit {



  ngOnInit(): void {
    this.linkForm.setValue({
      title: this.link.title,
      subtitle: this.link.subtitle,
      url: this.link.url,
      status: this.link.status.id,
    })
  }

  @Input() detailListener!: DetailListener;
  @Input() link!: LinkUI;


  listStatus : ItemList[] = [
    {
      id: 1,
      name: 'Activo'
    },
    {
      id: 2,
      name: 'Inactivo'
    }
  ]


  linkForm = new FormGroup({
    title: new FormControl(),
    subtitle: new FormControl(),
    url: new FormControl(),
    status: new FormControl(),
  })


  close() {
    this.detailListener.close();
  }

  onSubmit() {
    this.detailListener.submit(this.linkForm);
  }


 }
