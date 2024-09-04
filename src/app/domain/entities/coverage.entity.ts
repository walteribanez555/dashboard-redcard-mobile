export class CoverageEntity {
  constructor(
    public readonly coverage_id: number | null,
    public readonly id : number | null,
    public readonly title: string,
    public readonly description: string,
    public readonly files: string[],
  ) {}

  public static fromObject(object: { [key: string]: any }) {
    const { coverageId, id,  title, description, files } = object;

    if (!coverageId || !id) return ['Coverage Id is required', undefined];
    if (!title) return ['Title is required', undefined];
    if (!description) return ['Description is required', undefined];
    if (!files) return ['Files is required', undefined];

    return [
      undefined,
      new CoverageEntity(coverageId,id, title, description, files),
    ];
  }
}
