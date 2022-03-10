class Teller {
  static parseTotalValue(quantity, unitCost) {
    if (!quantity) return unitCost;
    return (quantity * unitCost).toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  static parseUnitCost(unitCost) {
    let value = parseFloat(unitCost);
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }
}

export default Teller;
