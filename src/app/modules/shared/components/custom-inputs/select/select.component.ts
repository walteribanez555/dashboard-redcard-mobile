import { CommonModule, NgClass } from '@angular/common';
import {  AfterViewInit, ChangeDetectorRef, Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { ItemListComponent } from '../../item-list/item-list.component';
import { ListviewComponent } from '../../listview/listview.component';
import { ItemList } from '../../item-list/interfaces/ItemList.interfaces';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    ListviewComponent,
    FormsModule,
    SvgIconComponent,
    NgClass,
  ],
  providers : [
    {
      provide : NG_VALUE_ACCESSOR,
      useExisting : forwardRef(() => SelectComponent),
      multi : true
    }
  ],
  templateUrl : './select.component.html',

})
export class SelectComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  onChange?: (v : number) => void;
  onTouched?: () => void;

  value : number | null = null;

  isDisabled = false;

  isHidden = true;

  private cdr = inject(ChangeDetectorRef);




  writeValue(index : number | null): void {
    this.value = index;

    this.searchInput = this.items.find((item) => item.id == index)?.name || 'Select item';

    if (this.value) {
      console.log("Hay valor ",this.value);
    }else{
      console.log("No hay valor ",this.value);
      console.log("Items ",this.items);
    }

    this.cdr.markForCheck();
  }


  registerOnChange(fn: any): void {

    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {

    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {

    this.isDisabled = isDisabled;
  }

  changeValue( value : number) : void {


    this.value = value;
    this.searchInput = this.items.find((item) => item.id == value)?.name || 'Select item';

    this.onTouched?.();
    this.onChange?.(value);
  }

  ngOnInit(): void {



  }

  ngAfterViewInit(): void {

  }

  searchTerm(event: any) {
    if (event.target.value) this.searchTerm$.next(event.target.value);
  }

  searchTerm$ = new Subject<string>();

  @Input() items!: ItemList[];
  @Input() withFilter: boolean = false;

  isToggle: boolean = false;
  searchInput: string = 'Select';

  searchText = '1';

  onSelectItem = (item: ItemListComponent) => {
    this.searchInput = item.name;
    this.changeValue(item.id);
    this.updateToggle();
  };


  updateToggle() {

    const stateHidden = this.isHidden;
    this.isToggle = !this.isToggle;
    this.isHidden = !stateHidden;

    this.cdr.detectChanges();
  }



 }
