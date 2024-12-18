interface ItemInterface {
  name: string;
  sellIn: number;
  quality: number;

  updateSellIn(): void;
}

// We altered the Item class, I don't really see the point of this rule.
// The goblin can go to hell.
export class Item implements ItemInterface {
  static readonly MAX_QUALITY = 50;
  static readonly MIN_QUALITY = 0;

  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    this.quality = Math.max(quality, Item.MIN_QUALITY);
  }

  public updateSellIn() {
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
    this.quality = Math.max(this.quality - amount, Item.MIN_QUALITY);
  }

  protected increaseQuality() {
    this.quality = Math.min(this.quality + 1, Item.MAX_QUALITY);
  }

  protected isSellInExpired(): boolean {
    return this.sellIn < 0;
  }
}

export class Sulfuras extends Item {
  // Legendary item, quality and sellIn never change
  public override updateSellIn() {}
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
      this.quality = Item.MIN_QUALITY; // Becomes worthless after the event

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
  public override updateQuality() {
    this.decreaseQuality(2);

    if (this.isSellInExpired()) {
      this.decreaseQuality(2);
    }
  }
}

export class Shop {
  constructor(public items: Array<ItemInterface> = []) {
    this.items = items;
  }

  updateSellIn() {
    this.items.forEach((item) => item.updateSellIn());

    return this.items;
  }
}
