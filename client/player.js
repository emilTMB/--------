class Player {
  constructor(name, wisdom, agility) {
    this.name = name;
    this.wisdom = wisdom;
    this.agility = agility;
    this.health = 10;
    this.armor = 0;
    this.inventory = [];
  }

  // Метод для обновления состояния игрока
  update(data) {
    this.health = data.health;
    this.armor = data.armor;
    this.inventory = data.inventory;
  }
}