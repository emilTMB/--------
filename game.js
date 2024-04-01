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
}

class Player {
  constructor(name, wisdom, agility) {
    this.name = name;
    this.wisdom = wisdom;
    this.agility = agility;
    this.inventory = [];
    this.health = 10; // добавим здоровье игроку
    this.armor = 10; // добавим броню игроку
  }

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
}

class Goblin {
  constructor(health, armor, damage) {
    this.health = health;
    this.armor = armor;
    this.damage = damage; // добавим урон гоблину
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
}

class Stone {
  constructor(damage) {
    this.damage = damage;
  }
}

// Создаем функцию для генерации случайных чисел
function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Создаем функцию для обработки ходов игрока и гоблина
function handleTurn(player, goblin, placeInventory) {
  // Проверяем, видит ли игрок гоблина
  const wisdomRoll = rollDice(20) + player.wisdom;
  console.log(`Внимание: ${wisdomRoll}`);

  if (wisdomRoll > 10) {
    console.log(`${player.name} видит гоблина!`);

    // Игрок поднимает камень в руку
    player.pickUpStone(placeInventory);
    console.log(`${player.name} поднял камень!`);

    // Игрок бросает камень в гоблина
    player.throwStone(goblin);
  } else {
    console.log(`${player.name} не видит гоблина!`);
  }

  // Гоблин атакует игрока
  goblin.attack(player);
}

// Создаем функцию для обновления состояния игры и вывода информации в чат
function updateGameState(player, goblin) {
  console.log(`${player.name}: ${player.health} HP`);
  console.log(`Гоблин: ${goblin.health} HP`);
}

// Создаем функцию для запуска игры
function startScene() {
  console.log('Игрок идет по полю')
  // Создаем игрока и гоблина
  const player = new Player('Игрок', 2, 3);
  const goblin = new Goblin(5, 12, 2);

  // Создаем инвентарь места
  const placeInventory = new PlaceInventory();

  // Добавляем камень в инвентарь места (так же можно что-то добавлять в цикле используя "Матс.Рандом" лисичек, зайчиков да и те же камни)
  placeInventory.items.push(new Stone(2), new Stone(3), new Stone(4));
  
  // Запускаем цикл игры
  while (player.health > 0 && goblin.health > 0) {
    // Обрабатываем ходы игрока и гоблина
    handleTurn(player, goblin, placeInventory);
  
    // Обновляем состояние игры и выводим информацию в чат
    updateGameState(player, goblin);
  }
  
  // Выводим сообщение о конце игры
  if (player.health > 0) {
    console.log(`${player.name} победил!`);
  } else {
    console.log(`Гоблин победил!`);
  }
}
startScene();  