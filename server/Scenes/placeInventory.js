class PlaceInventory {
    constructor() {
      this.items = [];
    }
  
    addItem(item) {
      this.items.push(item);
    }
  
    removeItem(item) {
      const index = this.items.indexOf(item);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  
    getItemsByType(type) {
      return this.items.filter(item => item instanceof type);
    }
  
    // Метод для преобразования объекта PlaceInventory в JSON
    toJSON() {
      return {
        items: this.items.map(item => item.toJSON())
      };
    }
  }
  
  module.exports = PlaceInventory;