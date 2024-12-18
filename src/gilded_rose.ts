interface ItemInterface {
  name: string;
  sellIn: number;
  quality: number;

  decreaseSellIn(): void;
}

// We altered the Item class, I don't really see the point of this rule.
// The goblin can go to hell.
export class Item implements ItemInterface {
  protected readonly MAX_QUALITY: number = 50;
  protected readonly MIN_QUALITY: number = 0;

  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    this.quality = Math.max(quality, this.MIN_QUALITY);
  }

  public decreaseSellIn() {
    this.sellIn--;

    this.updateQuality();
  }

  protected updateQuality() {
    this.decreaseQuality();

    if (this.isSellInExpired()) {
      this.decreaseQuality();
    }
  }

  protected decreaseQuality(amount = 1) {
    this.quality = Math.max(this.quality - amount, this.MIN_QUALITY);
  }

  protected increaseQuality() {
    this.quality = Math.min(this.quality + 1, this.MAX_QUALITY);
  }

  protected isSellInExpired(): boolean {
    return this.sellIn < 0;
  }
}

export class Sulfuras extends Item {
  protected override MAX_QUALITY = 80;

  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    super(name, sellIn, quality);

    this.quality = this.MAX_QUALITY;
  }

  // Legendary item, quality and sellIn never change
  public override decreaseSellIn() {}
}

export class AgedBrie extends Item {
  public override updateQuality() {
    this.increaseQuality();

    if (this.isSellInExpired()) {
      this.increaseQuality();
    }
  }
}

export class BackstagePasses extends Item {
  public override updateQuality() {
    if (this.isSellInExpired()) {
      this.quality = this.MIN_QUALITY; // Becomes worthless after the event

      return;
    }

    this.increaseQuality();

    if (this.sellIn <= 10) {
      this.increaseQuality();
    }

    if (this.sellIn <= 5) {
      this.increaseQuality();
    }
  }
}

export class Conjured extends Item {
  // Degrades in quality twice as fast
  public override updateQuality() {
    this.decreaseQuality(2);

    if (this.isSellInExpired()) {
      this.decreaseQuality(2);
    }
  }
}

export class Shop {
  constructor(public items: Array<ItemInterface> = []) {}

  decreaseSellIn() {
    this.items.forEach((item) => item.decreaseSellIn());

    return this.items;
  }
}
