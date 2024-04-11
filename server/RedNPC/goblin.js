const rollDice = require('../mechGame/rollDice');

class Goblin {
    constructor(health, armor, damage) {
      this.health = health;
      this.armor = armor;
      this.damage = damage;
    }
  
    // Метод для атаки гоблина по игроку
    attack(player) {
      const roll = rollDice(20);
  
      if (roll > player.armor) {
        player.health -= this.damage;
        console.log(`Гоблин атаковал ${player.name}!`);
      } else {
        console.log(`Гоблин промахнулся!`);
      }
    }
  
    // Метод для преобразования объекта гоблина в JSON
    toJSON() {
      return {
        health: this.health,
        armor: this.armor,
        damage: this.damage
      };
    }
  }
  
  module.exports = Goblin;