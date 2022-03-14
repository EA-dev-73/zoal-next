export class Price {
  constructor(private readonly rawPrice: number) {}
  private round() {
    return this.rawPrice.toFixed(2);
  }
  format() {
    return this.round() + "€";
  }
}
