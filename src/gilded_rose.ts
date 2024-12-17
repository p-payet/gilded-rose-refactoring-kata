interface ItemInterface {
  name: string;
  sellIn: number;
  quality: number;

  updateQuality(): void;
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

  public updateQuality() {
    this.sellIn--;

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
  public override updateQuality() {}
}

export class AgedBrie extends Item {
  public override updateQuality() {
    this.sellIn--;

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
    this.sellIn--;

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
    this.sellIn--;

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

  updateQuality() {
    this.items.forEach((item) => item.updateQuality());

    return this.items;
  }
}
