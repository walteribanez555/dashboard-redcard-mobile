import { UploadFileDto } from "../files/upload-file.dto";


export class UpdateDiscountDto {
  constructor(
    public readonly discount_id: number,
    public readonly title : number,
    public readonly description : string,
    public readonly amount : string,
    public readonly type: number,
    public readonly previousFiles : string[],
    public files: UploadFileDto[],
   ) {

  }


  public static create( props: {[key:string]:any})  {
    const { discountId, discountTitle, discountDescription, discountAmount, discountType, previousFiles, imagesUrl } = props;

    if( !discountId ) return ['discountId is required',undefined];
    if( !discountTitle ) return ['discountTitle is required',undefined];
    if( !discountDescription ) return ['discountDescription is required',undefined];
    if( !discountAmount ) return ['discountAmount is required',undefined];
    if( !discountType ) return ['discountType is required',undefined];
    if( !imagesUrl ) return ['imagesUrl is required',undefined];
    if( !previousFiles) return ['previousFiles is required',undefined];

    return [
      undefined,
      new UpdateDiscountDto(discountId, discountTitle, discountDescription, discountAmount, discountType, previousFiles, imagesUrl),
    ];



  }
}
