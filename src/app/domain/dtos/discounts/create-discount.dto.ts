import { UploadFileDto } from "../files/upload-file.dto";

export class CreateDiscountDto {
  constructor(
    public readonly title : string,
    public readonly description : string,
    public readonly amount : number,
    public readonly type: number,
    public  images : UploadFileDto[],
   ){

  }


  public static create(  props : {[key:string]:any}) {
    const { title, description, amount, type, images } = props;

    if( !title) return ['Title is required', undefined];
    if( !description) return ['Description is required', undefined];
    if( !amount) return ['Amount is required', undefined];
    if( !type) return ['Type is required', undefined];
    if( !images) return ['Images is required', undefined];

    return [undefined, new CreateDiscountDto(title, description, amount, type, images)];

  }
}
