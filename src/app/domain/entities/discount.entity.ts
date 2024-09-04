export class DiscountEntity {
  constructor(
    public readonly discount_id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly amount: number,
    public readonly type: number,
    public readonly imagesUrl: string[]
  ) {}

  public static fromObject(props: { [key: string]: any }) {
    const { discount_id, title, description, amount, type, imagesUrl } = props;

    if (!discount_id) return ['discount_id is required', undefined];
    if (!title) return ['title is required', undefined];
    if (!description) return ['description is required', undefined];
    if (!amount) return ['amount is required', undefined];
    if (!type) return ['type is required', undefined];
    if (!imagesUrl) return ['imagesUrl is required', undefined];

    return [
      undefined,
      new DiscountEntity(
        discount_id,
        title,
        description,
        amount,
        type,
        imagesUrl
      ),
    ];
  }
}
