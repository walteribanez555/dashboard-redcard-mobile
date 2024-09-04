export class UploadFileDto {
  constructor(
    public readonly file: File,
    public readonly filename : string,
  ) { }


  public static create(props: { [key: string]: any }) {
    const { file, filename } = props;

    if(!file) return ['File is required', undefined];
    if(!filename) return ['Filename is required', undefined];
    return [undefined, new UploadFileDto(file, filename)];

  }
}
