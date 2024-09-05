import { UploadFileDto } from "../files/upload-file.dto";


export class UpdateDiscountDto {
  constructor(
    public readonly discount_id: number,
    public readonly title : string,
    public readonly description : string,
    public readonly amount : number,
    public readonly type: number,
    public readonly previousFiles : string[],
    public files: UploadFileDto[],
   ) {

  }


  public static create( props: {[key:string]:any})  {
    const { discountId, title, description, value, type, previousFiles, images } = props;

    if( !discountId ) return ['discountId is required',undefined];
    if( !title ) return ['discountTitle is required',undefined];
    if( !description ) return ['discountDescription is required',undefined];
    if( !value) return ['discountAmount is required',undefined];
    if( !type ) return ['discountType is required',undefined];
    if( !images ) return ['imagesUrl is required',undefined];
    if( !previousFiles) return ['previousFiles is required',undefined];

    return [
      undefined,
      new UpdateDiscountDto(discountId, title, description, value, type, previousFiles, images),
    ];



  }
}
