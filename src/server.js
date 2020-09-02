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

const winCombos = [
    [1,2,3],
    [1,4,7],
    [7,8,9],
    [4,5,6],
    [1,5,9],
    [3,5,7],
    [2,5,8],
    [3,6,9]
]
const checker = (arr, target) => target.every(v => arr.includes(v));

const checkGame = (cells) => {
    let result = false
    for(let i = 0; i < winCombos.length; i++){
        if(checker(cells, winCombos[i])){
            result = true;
            break;
        }else {
            result = false;
        }
    }
    return result
}

function Player(id, name, cells, isPlaying){
    this.id = id;
    this.name = name;
    this.cells = cells;
    this.isPlaying = isPlaying;
}

function Game(cells, startPlay, movingPlayerId){
    this.cells = cells
    this.startPlay = startPlay
    this.movingPlayerId = movingPlayerId
    this.winner = ""
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
        info = 'Hi Player A, please make a move.'
        io.sockets.connected[socket.id].emit('info', info);
        //emit game user only to our first player
        io.sockets.connected[socket.id].emit('game', game);
    } else if(players.length === 2) {
        game.playerB.id = socket.id;
        game.startPlay = true
       /*  if(game.movingPlayerId === game.playerA.id) {
            info = 'Hi Player B! ...waiting for Player A';
        } else {
            info = 'Hi Player B! Please make a move.';
            game.movingPlayerId = game.playerB.id;
        } */
        info = 'Hi Player B, please make a move.';
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    }else {
        info = "Sorry, there are already two guys playing...!"
        io.sockets.connected[socket.id].emit('info', info);
        game.startPlay = false
        io.sockets.emit('game', game);
    };

    socket.on('handleClick', (data) => {
        let cellsToCheck = []
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
            game.movingPlayerId =  !game.playerA.isPlaying ? game.playerB.id : game.playerA.id
            cellsToCheck = !game.playerA.isPlaying ? data.playerOne.cells : data.playerTwo.cells
            if(checkGame(cellsToCheck)){
                game.winner = !game.playerA.isPlaying ? game.playerA.name : game.playerB.name
                io.sockets.emit('info', `${game.winner} won!!`);
            }
            io.sockets.emit('game', game);
        }
    })

    socket.on('playAgain', () => {
       // players = [];
        game.cells = game.cells.map(cell => ({ value: "", id: cell.id }));
        game.playerA.cells = []
        game.playerA.isPlaying = true
        game.playerB.cells = []
        game.playerB.isPlaying = false
        game.movingPlayerId = game.playerA.id
        game.winner= ""
        io.sockets.connected[game.playerA.id].emit('info', "Hi Player A, please make a move");
        io.sockets.connected[game.playerB.id].emit('info', "Hi Player B, please make a move");
        // io.sockets.emit('info', info);
        io.sockets.emit('game', game);
        // console.log(game)
        console.log(socket.id)
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
