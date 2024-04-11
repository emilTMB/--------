const rollDice = require('../mechGame/rollDice');

const Stone = require('../items/stone');

class Player {
    constructor(name, wisdom, agility) {
      this.name = name;
      this.wisdom = wisdom;
      this.agility = agility;
      this.inventory = [];
      this.health = 10; // добавим здоровье игроку
      this.armor = 10; // добавим броню игроку
    }


  /////// ВОЗМОЖНОСТИ ДЛЯ ВСЕХ ИГРОКОВ ПРЕНЕСТИ В ОТДЕЛЬНЫЙ КОМПОНЕНТ, ЗДЕСЬ ИХ ПОВЫЗЫВАТЬ/////////////

    // Метод для поднятия камня в руку
    pickUpStone(placeInventory) {
      const stones = placeInventory.getItemsByType(Stone);
      if (stones.length > 0) {
        const stoneIndex = placeInventory.items.indexOf(stones[stones.length - 1]);
        const stone = placeInventory.items.splice(stoneIndex, 1)[0];
        this.inventory.push(stone);
      } else {
        console.log('Здесь нет камней.');
      }
    }
  
    // Метод для выброса камня из инвентаря
    dropStone(placeInventory) {
      if (this.inventory.length > 0) {
        const stone = this.inventory.pop();
        placeInventory.addItem(stone);
      } else {
        console.log('У вас нет камней.');
      }
    }
    
  //////////////// ИЗМЕНИТЬ МЕТОД ДЛЯ БОЛЕЕ ГИБКОГО ПРИМЕНЕНИЯ ТАК ЖЕ НУЖНО БУДЕТ ДОБАВИТЬ КНОПКУ ТАРГЕТ В КЛИЕНТ И ПРИНИМАТЬ ЕЕ ЗНАЧЕНИЯ НА СЕРВЕРЕ ////////////////////////////
    //////////////////////////////////////////////// ТАРГЕТ СДЕЛАТЬ СЛОЖНЫМ ЧТОБЫ МОЖНО БЫЛО ТАРГЕТНУТЬ ЧЕЛОВЕКА И НПС ОТДЕЛЬНО /////////////////////////////////////////////////
    
    // Метод для броска камня в гоблина
    throwStone(goblin) {
      if (this.inventory.length > 0) {
        const stone = this.inventory.pop();
        const roll = rollDice(20) + this.agility;
  
        if (roll > goblin.armor) {
          goblin.health -= stone.damage;
          console.log(`${this.name} попал в гоблина!`);
        } else {
          console.log(`${this.name} промахнулся!`);
        }
      } else {
        console.log('У вас нет камней.');
      }
    }
  
    toJSON() {
      return {
        name: this.name,
        wisdom: this.wisdom,
        agility: this.agility,
        inventory: this.inventory,
        health: this.health,
        armor: this.armor
      };
    }
  }
  
  module.exports = Player;