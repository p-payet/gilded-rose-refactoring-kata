import { describe, it, expect } from '@jest/globals';
import {
  Item,
  AgedBrie,
  BackstagePasses,
  Sulfuras,
  Conjured,
  Shop,
} from "../src/gilded_rose";

const runSimulation = (items: Array<Item>, days: number): string => {
  const shop = new Shop(items);
  let output = "";

  for (let day = 0; day <= days; day++) {
    output += `-------- day ${day} --------\n`;
    output += "name, sellIn, quality\n";
    items.forEach(item => output += `${item.name}, ${item.sellIn}, ${item.quality}\n`);
    shop.decreaseSellIn();
    output += "\n";
  }

  return output;
}

describe("Gilded Rose Shop", () => {
  // Approval Testing (a.k.a: Golden Master)
  it("should match snapshot", () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20),
      new AgedBrie("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Sulfuras("Sulfuras, Hand of Ragnaros", 0, 80),
      new Sulfuras("Sulfuras, Hand of Ragnaros", -1, 80),
      new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 5, 49),
      new Conjured("Conjured Mana Cake", 3, 6),
    ];
    const output = runSimulation(items, 30);

    expect(output).toMatchSnapshot();
  });

  describe("Normal item", () => {
    it("should create an item named foo", () => {
      const shop = new Shop([new Item("foo", 0, 0)]);
      const items = shop.decreaseSellIn();
  
      expect(items[0].name).toBe("foo");
    });

    it("should never lower quality below 0", () => {
      const shop = new Shop([
        new Item("+5 Dexterity Vest", 5, 0),
        new Item("Elixir of the Mongoose", 0, 1),
      ]);
      const items = shop.decreaseSellIn();

      expect(items[0].sellIn).toBe(4);
      expect(items[0].quality).toBe(0);

      expect(items[1].sellIn).toBe(-1);
      expect(items[1].quality).toBe(0);
    });

    const testCases = [
      {
        name: "set quality to 0 if negative quality value is passed",
        item: new Item("+1 Dexterity Vest", 15, -2),
        expected: { sellIn: 14, quality: 0 },
      },
      {
        name: "lower sellIn and quality value at the end of the day",
        item: new Item("+5 Dexterity Vest", 10, 20),
        expected: { sellIn: 9, quality: 19 },
      },
      {
        name: "lower quality twice as fast when sellIn is inferior to 0",
        item: new Item("+5 Dexterity Vest", 0, 20),
        expected: { sellIn: -1, quality: 18 },
      },
    ];

    testCases.forEach(({ name, item, expected }) => {
      it(`should ${name}`, () => {
        const shop = new Shop([item]);
        const items = shop.decreaseSellIn();

        expect(items[0].sellIn).toBe(expected.sellIn);
        expect(items[0].quality).toBe(expected.quality);
      });
    });
  });

  describe("Aged Brie item", () => {
    it("should increase in quality at the end of the day", () => {
      const shop = new Shop([new AgedBrie("Aged Brie", 2, 7)]);
      const items = shop.decreaseSellIn();

      expect(items[0].sellIn).toBe(1);
      expect(items[0].quality).toBe(8);
    });

    it("should never exceed 50 in quality", () => {
      const shop = new Shop([new AgedBrie("Aged Brie", 0, 49)]);
      const items = shop.decreaseSellIn();

      expect(items[0].sellIn).toBe(-1);
      expect(items[0].quality).toBe(50);
    });
  });

  describe("Sulfuras item", () => {
    it("should always be 80 in quality and sellIn value should never decrease", () => {
      const shop = new Shop([new Sulfuras("Sulfuras, Hand of Ragnaros", -7, 80)]);
      const items = shop.decreaseSellIn();

      expect(items[0].sellIn).toBe(-7);
      expect(items[0].quality).toBe(80);
    });
  });

  describe("Backstage Passes item", () => {
    const testCases = [
      {
        name: "increase in quality at the end of the day, when sellIn value is superior or equal to 0",
        item: new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 15, 20),
        expected: { sellIn: 14, quality: 21 },
      },
      {
        name: "drop quality to 0, when sellIn value is inferior to 0",
        item: new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 0, 20),
        expected: { sellIn: -1, quality: 0 },
      },
      {
        name: "increase quality by 2, when sellIn value is inferior or equal to 10",
        item: new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 10, 20),
        expected: { sellIn: 9, quality: 22 },
      },
      {
        name: "increase quality by 3, when sellInvalue is inferior or equal to 5",
        item: new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 5, 20),
        expected: { sellIn: 4, quality: 23 },
      },
      {
        name: "never exceed 50 in quality",
        item: new BackstagePasses("Backstage passes to a TAFKAL80ETC concert", 5, 48),
        expected: { sellIn: 4, quality: 50 },
      },
    ];

    testCases.forEach(({ name, item, expected }) => {
      it(`should ${name}`, () => {
        const shop = new Shop([item]);
        const items = shop.decreaseSellIn();

        expect(items[0].sellIn).toBe(expected.sellIn);
        expect(items[0].quality).toBe(expected.quality);
      });
    });
  });

  describe("Conjured item", () => {
    it("should degrade in quality twice as fast as normal items", () => {
      const shop = new Shop([
        new Conjured("conjured", 10, 20),
        new Item("foo", 10, 20),
      ]);
      const items = shop.decreaseSellIn();

      expect(items[0].quality).toBe(18);
      expect(items[1].quality).toBe(19);
    });

    it("should never lower quality below 0", () => {
      const shop = new Shop([new Conjured("conjured", 10, 0)]);
      const items = shop.decreaseSellIn();

      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(0);
    });
  });
});
