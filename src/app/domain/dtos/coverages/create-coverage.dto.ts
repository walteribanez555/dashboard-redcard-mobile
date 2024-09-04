import { UploadFileDto } from '../files/upload-file.dto';

export class CreateCoverageDto {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public files: UploadFileDto[]
  ) {}

  public static create(props: { [key: string]: any }) {
    const { service_id, title, description, files } = props;

    if (!service_id) return ['Service Id is required', undefined];
    if (!title) return ['Title is required', undefined];
    if (!description) return ['Description is required', undefined];
    if (!files) return ['Files is required', undefined];
    return [
      undefined,
      new CreateCoverageDto( title, description, files),
    ];
  }
}
