export class DeleteCoverageDto {
  constructor(public readonly id: number, public readonly files: string[]) {}

  public static  create(props: { [key: string]: any }) {
    const { id, files } = props;

    if (!id) return ['Id is required', undefined];
    if (!files) return ['Files is required', undefined];

    return [undefined, new DeleteCoverageDto(id, files)];
  }
}
