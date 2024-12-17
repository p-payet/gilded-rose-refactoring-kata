interface ItemInterface {
  name: string;
  sellIn: number;
  quality: number;

  updateQuality(): void;
}

// We altered the Item class, I don't really see the point of this rule.
// The goblin can go to hell.
export class Item implements ItemInterface {
  static maxQuality = 50;

  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality > 0 ? quality : 0;
  }

  public updateQuality() {
    this.sellIn--;

    this.decreaseQuality();

    if (this.isSellInExpired) {
      this.decreaseQuality();
    }
  }

  public decreaseQuality() {
    if (this.quality > 0) {
      this.quality--;
    }
  }

  public increaseQuality() {
    if (this.isQualityInferiorToMaxQuality) {
      this.quality++;
    }
  }

  get isQualityInferiorToMaxQuality(): boolean {
    return this.quality < Item.maxQuality;
  }

  get isSellInExpired() {
    return this.sellIn < 0;
  }
}

export class Sulfuras extends Item {
  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    super(name, sellIn, quality);
  }

  public override updateQuality() {}
}

export class AgedBrie extends Item {
  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    super(name, sellIn, quality);
  }

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

  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    super(name, sellIn, quality);
  }

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
      this.quality = 0;
    }
  }
}

export class Conjured extends Item {
  constructor(
    public name: string,
    public sellIn: number,
    public quality: number
  ) {
    super(name, sellIn, quality);
  }

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
