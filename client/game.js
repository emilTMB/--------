const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', function() {
  console.log('Соединение установлено');
});

ws.addEventListener('message', function(event) {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'init':
      // Обрабатываем начальное состояние игры
      const player = new Player(data.data.player.name, data.data.player.wisdom, data.data.player.agility);
      player.health = data.data.player.health;
      player.armor = data.data.player.armor;
      player.inventory = data.data.player.inventory;
      // ...
      break;
    case 'update':
      // Обрабатываем обновленное состояние игры
      player.health = data.data.player.health;
      player.armor = data.data.player.armor;
      player.inventory = data.data.player.inventory;
      // ...
      break;
  }
});

ws.addEventListener('close', function() {
  console.log('Соединение прервано');
});

// Обрабатываем действие игрока
function handlePlayerAction(actionType) {
  ws.send(JSON.stringify({
    type: 'action',
    data: {
      type: actionType,
    }
  }));
}

// // Обрабатываем нажатие на кнопку "Осмотреться"
// const lookAroundButton = document.getElementById('lookAroundButton');
// lookAroundButton.addEventListener('click', function() {
//   handlePlayerAction('lookAround');
// });

// Обрабатываем нажатие на кнопку "Поднять камень"
const pickUpStoneButton = document.getElementById('pickUpStoneButton');
pickUpStoneButton.addEventListener('click', function() {
  handlePlayerAction('pickUpStone');
});

// Обрабатываем нажатие на кнопку "Бросить камень"
const throwStoneButton = document.getElementById('throwStoneButton');
throwStoneButton.addEventListener('click', function() {
  handlePlayerAction('throwStone');
});