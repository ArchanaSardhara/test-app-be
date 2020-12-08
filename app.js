const connection = require('./connection');
const route = connection.app;
const { playerList, addPlayer, deletePlayer, editPlayer, getPlayer } = require('./routes/player');

// routes for the app

route.get('/players', playerList);
route.get('/player/:id', getPlayer);
route.get('/delete/:id', deletePlayer);
route.post('/add', addPlayer);
route.post('/edit/:id', editPlayer);