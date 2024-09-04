import { CommonModule } from '@angular/common';
import {  ChangeDetectorRef, Component, forwardRef,  inject,  Injector,  OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  styleUrls: ['./file-input.component.css'],
  templateUrl : './file-input.component.html',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers : [
    {
      provide : NG_VALUE_ACCESSOR,
      useExisting : forwardRef(() => FileInputComponent),
      multi : true
    }
  ],

})
export class FileInputComponent implements ControlValueAccessor, OnInit {

    onChange?: ( v : File) => void;
    onTouched?: ( ) => void;

    isDisabled = false;

    private cdr = inject(ChangeDetectorRef);


  constructor(


  ){

  }


  ngOnInit(): void {
  }

  writeValue(file : File | null): void {
    this.file = file;
    if(file) {
      this.fileName = file.name;
      this.setImageToView(file);
    }

    this.cdr.markForCheck();
  }


  registerOnChange(fn: (v : File) => void): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    //set the disable state to not
    this.isDisabled = isDisabled;
  }

  changeValue( value : File ): void{
    this.file = value;
    this.onTouched?.();
    this.onChange?.(value);
    this.cdr.detectChanges();

  }



  fileName = 'Agregar Archivo';

  imgBase64 : string | null = null;

  file  : File | null = null;

  //#inputFile how to get the element to dispatch then the even onchange

  @ViewChild('inputFile') inputFile: any;




  onClickInputWrapper( ) {

    if(this.isDisabled) {
      return;
    }
    this.inputFile.nativeElement.click();
    this.cdr.detectChanges();
  }


  onChangeFile(event : any) {
    let file = event.target.files[0];
    //get the name and set on a const
    this.fileName = file.name;

    //Get the file convert to base64 to show on img input


    if(file) {
      this.setImageToView(file);
    }

    this.changeValue(file);
    this.cdr.detectChanges();


  }


  setImageToView( file :File) {

    let reader = new FileReader();
    reader.readAsDataURL(file);


    reader.onload = () => {
      this.imgBase64 = reader.result as string;
    };

    reader.onloadend = () => {
      this.cdr.detectChanges();
    }



  }




 }
