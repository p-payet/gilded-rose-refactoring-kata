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

    if (this.isSellInExpired) {
      this.decreaseQuality();
    }
  }

  public decreaseQuality() {
    if (this.quality > Item.MIN_QUALITY) {
      this.quality--;
    }
  }

  public increaseQuality() {
    if (this.isQualityInferiorToMaxQuality) {
      this.quality++;
    }
  }

  get isQualityInferiorToMaxQuality(): boolean {
    return this.quality < Item.MAX_QUALITY;
  }

  get isSellInExpired() {
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

    if (this.isSellInExpired) {
      this.increaseQuality();
    }
  }
}

export class BackstagePasses extends Item {
  private sellInFiveDays = 5;
  private sellInTenDays = 10;

  public override updateQuality() {
    this.increaseQuality();

    if (this.sellIn <= this.sellInTenDays) {
      this.increaseQuality();
    }

    if (this.sellIn <= this.sellInFiveDays) {
      this.increaseQuality();
    }

    if (this.isSellInExpired) {
      this.quality = Item.MIN_QUALITY;
    }
  }
}

export class Conjured extends Item {
  public override updateQuality() {
    this.decreaseQuality();

    if (this.isSellInExpired) {
      this.decreaseQuality();
    }
  }

  public override decreaseQuality() {
    super.decreaseQuality();
    super.decreaseQuality();
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
