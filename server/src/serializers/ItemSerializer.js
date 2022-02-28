class ItemSerializer {
  static async getItemCollectionDetails(items) {
    return Promise.all(
      items.map((item) => {
        return this.getItemDetail(item);
      })
    );
  }

  static async getItemDetail(item) {
    const allowedAttributes = ["id", "name", "description", "categoryId", "roomId", "image"];

    let serializedItem = {};
    for (const attribute of allowedAttributes) {
      serializedItem[attribute] = item[attribute];
    }

    const category = await item.$relatedQuery("category");
    if (category) {
      serializedItem.category = category.name;
      if (category.color) {
        serializedItem.color = category.color;
      }
    }
    return serializedItem;
  }
}

export default ItemSerializer;
