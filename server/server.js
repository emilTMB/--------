const WebSocket = require('ws');
// const rollDice = require('./mechGame/rollDice');
const Player = require('./player/player');
const Goblin = require('./RedNPC/goblin');
const PlaceInventory = require('./Scenes/placeInventory');
const Stone = require('./items/stone');

const wss = new WebSocket.Server({ port: 8080 });

const players = {};
const goblins = {};


////////////////////////////////////////////////////////////////////// МОЯ ОСНОВНАЯ ФУНКЦИЯ///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Возможно стоит вынести ее в отдельный компонент, для того чтобы использовать для любых кастомных сцен /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function handleTurn(player, goblin, placeInventory) {
  // Обрабатываем действия гоблина
  goblin.attack(player);

  // Обрабатываем действия игрока СКОРЕЕ ВСЕГО ЭТО НУЖНО ВЫНЕСТИ В ОБДЕЛЬНОЕ МЕСТО (ОБРАБОТКА ДЕЙСТВИЙ ИГРОКА)
  // const wisdomRoll = rollDice(20) + player.wisdom;
  if (playerAction !== null) {
  // if (wisdomRoll > 10 && playerAction !== null) {
    // Обрабатываем действие, выбранное игроком
    if (playerAction.type === 'pickUpStone') {
      if (placeInventory.items.length != 0) {
        player.pickUpStone(placeInventory);
        console.log(`${player.name} поднял камень!`);
      } else {
        console.log(`${player.name} Поблизости нет камней!`);
      }
      // проверка на осмотреться тоже должна быть здесь. (если я хочу проверять)
      /////////////
    } else if (playerAction.type === 'throwStone') {
      if (player.inventory.length > 0) {
        player.throwStone(goblin);
        console.log(`${player.name} бросил камень и нанес ${player.damage} урона!`);
      } else {
        console.log(`${player.name} не имеет камней в инвентаре!`);
      }
    }

    // Обновляем состояние игры и выводим информацию в чат
    updateGameState(player, goblin);

    // Сбрасываем действие игрока
    playerAction = null;
  }
}
//////////////////////////////////////////////////////// КОНЕЦ ОСНОВНОЙ ФУНКЦИИ ////////////////////////////////////////////////////////////////
let playerAction = null;

///////////////////// обновляем состояние игры для ЭТОЙ сцены ///////////////////////////
function updateGameState(player, goblin) {
  // Обновляем состояние игры
  // ...

  // Отправляем обновленное состояние игры всем клиентам
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'update',
        data: {
          player: player.toJSON(),
          goblin: goblin.toJSON(),
        },
      }));
    }
  });
}

// ВЫНЕСТИ В ОТДЕЛЬНЫЙ КОМПОНЕНТ РАБОТАЕТ ФУНКЦИЯ ДОЛЖНА РАБОТАТЬ ДЛЯ КАДОЙ СЦЕНЫ
function startScene(ws, player, goblin, placeInventory) {
  setInterval(() => {
    handleTurn(player, goblin, placeInventory);
  }, 2000);

  ws.send(JSON.stringify({
    type: 'init',
    data: {
      player: player.toJSON(),
      goblin: goblin.toJSON(),
      placeInventory: placeInventory.toJSON()
    }
  }));
}

wss.on('connection', function connection(ws) {
  // Создаем нового игрока
  const player = new Player('Игрок', 2, 3);

  // Создаем нового гоблина
  const goblin = new Goblin(5, 12, 2);

  // Создаем инвентарь окружения PlaceInventory
  const placeInventory = new PlaceInventory();
  placeInventory.addItem(new Stone(2));
  placeInventory.addItem(new Stone(3));
  placeInventory.addItem(new Stone(4));

  // Добавляем игрока в список игроков
  players[ws.id] = player;
  goblins[ws.id] = goblin; // Добавляем гоблина в список гоблинов

  // Отправляем текущее состояние игры клиенту
  ws.send(JSON.stringify({
    type: 'init',
    data: {
      player: player.toJSON(),
      goblin: goblin.toJSON(),
      placeInventory: placeInventory.toJSON()
    }
  }));

  // Присваиваем игроку id соединения
  player.id = ws.id;

  // Запускаем сцену
  startScene(ws, player, goblin, placeInventory);

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    // Обрабатываем действие игрока
    switch (data.type) {
      case 'action':
        playerAction = data.data;
        break;
    }
  });

  ws.on('close', function close() {
    delete players[ws.id];
    delete goblins[ws.id]; // Удаляем гоблина из списка гоблинов
  });
});