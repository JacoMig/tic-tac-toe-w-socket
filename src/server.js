const io = require('socket.io')();

let info = ''
let count = 0
let players = []
const initCells = [
    {value: "",  id: 1},    
    {value: "",  id: 2},    
    {value: "",  id: 3},    
    {value: "",  id: 4},    
    {value: "",  id: 5},    
    {value: "",  id: 6},    
    {value: "",  id: 7},    
    {value: "",  id: 8},    
    {value: "",  id: 9},   
] 
function Player(id, name, cells, isPlaying){
    this.id = id;
    this.name = name;
    this.cells = cells;
    this.isPlaying = isPlaying;
}

function Game(PlayerA, PlayerB, cells, startPlay, movingPlayerId){
    this.PlayerA = PlayerA
    this.PlayerB = PlayerB
    this.cells = cells
    this.startPlay = startPlay
    this.movingPlayerId = movingPlayerId
}
const game = new Game()

io.on('connection', (socket) => {
    console.log('user '+socket.id+' connected')
    players.push(socket);
    if(players.length === 1){   
        player = new Player(socket.id, 'Player A', [], true);
        game.playerA = player;
        game.playerB = new Player('notAvailable', 'Player B', [], false);
        game.startPlay = false
        game.cells = initCells
        game.movingPlayerId = game.playerA.id
        /*  
        game.playerB = new Player('notAvailable', 'Player B', [randomNumber], false);
        game.movingPlayerId = game.playerA.id;
        game.operators = []; */
        info = 'Hi Player A, please make a move.'
        io.sockets.connected[socket.id].emit('info', info);
        //emit game user only to our first player
        io.sockets.connected[socket.id].emit('game', game);
    } else if(players.length === 2) {
        game.playerB.id = socket.id;
        game.startPlay = true
        
        if(game.movingPlayerId === game.playerA.id) {
            info = 'Hi Player B! ...waiting for Player A';
        } else {
            info = 'Hi Player B! Please make a move.';
            game.movingPlayerId = game.playerB.id;
        }
     //   info = 'Hi Player B! Please make a move.';
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    }else {
        info = "Sorry, there are already two guys playing...!"
        io.sockets.connected[socket.id].emit('info', info);
        game.startPlay = false
        io.sockets.emit('game', game);
    };

    socket.on('handleClick', (data) => {
        if(game.playerB.name !== 'notAvailable'){
            game.playerA = {
                ...game.playerA, 
                cells:  data.playerOne.cells, 
                isPlaying: !game.playerA.isPlaying}
            game.playerB = {
                ...game.playerB, 
                cells:  data.playerTwo.cells, 
                isPlaying: !game.playerB.isPlaying} 
            game.cells = game.cells.map(c => {
                            if(c.id === data.id ){
                                c.value = game.playerA.isPlaying ? "X" : "O"
                            }
                            return c
                        })
            game.movingPlayerId =  data.socketId
            io.sockets.emit('game', game);
        }
        
        console.log(data) 
        

    })

    socket.on('disconnect', function() {
        //remove player from list
        var index = players.indexOf(socket);
        if (index != -1) {
            players.splice(index, 1);
        }
        //TODO error handling for game
        //io.close();
    });


  });

const port = 3000;
io.listen(port);
console.log('listening on port ', port);
