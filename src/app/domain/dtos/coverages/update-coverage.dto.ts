import { UploadFileDto } from "../files/upload-file.dto";

export class UpdateCoverageDto {
  constructor(
    public readonly coverage_id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly previousFiles : string[],
    public  files : UploadFileDto[],
  ) {}

  public static create(props: { [key: string]: any }) {
    const { coverageId, serviceId, title, description, previousFiles , files } = props;

    if (!coverageId) return ['Coverage Id is required', undefined];
    if (!serviceId) return ['Service Id is required', undefined];
    if (!title) return ['Title is required', undefined];
    if (!description) return ['Description is required', undefined];
    if( !previousFiles) return ['Previous Files is required', undefined];
    if (!files) return ['Files is required', undefined];


    return [
      undefined,
      new UpdateCoverageDto(coverageId, title, description, previousFiles, files),
    ];
  }
}
