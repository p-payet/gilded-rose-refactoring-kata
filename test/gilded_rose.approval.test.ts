import { describe, it, expect } from '@jest/globals';
import {
    Item,
    Shop,
} from "../src/gilded_rose";
import {
    agedBrieItemFactory,
    backstagePassesItemFactory,
    conjuredItemFactory,
    normalItemFactory,
    sulfurasItemFactory,
} from './gilded_rose.spec.test';

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

describe("Gilded Rose Shop Approval Testing", () => {
    // Approval Testing (a.k.a: Golden Master)
    it("should match snapshot", () => {
      const items = [
        normalItemFactory(10, 20),
        agedBrieItemFactory(2, 0),
        normalItemFactory(5, 7),
        sulfurasItemFactory(0, 80),
        sulfurasItemFactory(-1, 80),
        backstagePassesItemFactory(15, 20),
        backstagePassesItemFactory(10, 49),
        backstagePassesItemFactory(5, 49),
        conjuredItemFactory(3, 6),
      ];
      const output = runSimulation(items, 30);

      expect(output).toMatchSnapshot();
    });
});