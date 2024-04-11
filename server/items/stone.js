class Stone {
    constructor(damage) {
      this.damage = damage;
    }
  
    toJSON() {
      return {
        damage: this.damage
      };
    }
  }
  
  module.exports = Stone;