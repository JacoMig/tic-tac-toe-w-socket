import React, {useState, useEffect} from 'react'
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

const Game = (props) => {
    
    // const cell = {value: "",  id: 1};
    const [cells, setCells] = useState([])
    const [playerOne, setPlayerOne] = useState({cells: [], isPlaying: true})
    const [playerTwo, setPlayerTwo] = useState({cells: [], isPlaying: false})
    const [info, setInfo] = useState()
    const [startPlay, setStartPlay] = useState(false)
    const [movingPlayerId, setMovingPlayerId ] = useState()
    const [player, setPlayer] = useState()

    const clickCell = (id) => {
       
       // setPlayerOne({cells: playerOne.isPlaying ? [...playerOne.cells, id] : [...playerOne.cells], isPlaying: !playerOne.isPlaying})
       // setPlayerTwo({cells: playerTwo.isPlaying ? [...playerTwo.cells, id] : [...playerTwo.cells], isPlaying: !playerTwo.isPlaying})
       console.log(socket.id)
       if(startPlay && movingPlayerId === socket.id){
            socket.emit('handleClick',  {
                playerOne: {
                    cells: playerOne.isPlaying ? [...playerOne.cells, id] : [...playerOne.cells],
                    isPlaying: !playerOne.isPlaying
                },
                playerTwo: {
                    cells: playerTwo.isPlaying ? [...playerTwo.cells, id] : [...playerTwo.cells],
                    isPlaying: !playerTwo.isPlaying
                },
                id,
                socketId: socket.id
            });   
       }
    }

    const checker = (arr, target) => target.every(v => arr.includes(v));
    const winCombos = [
        [1,2,3],
        [1,4,7],
        [7,8,9],
        [4,5,6],
        [1,5,9],
        [3,5,7],
        [2,5,8]
    ]

    useEffect(() => {
       if(!playerOne.isPlaying){
        checkGame(playerOne.cells, "Player One")
       }else if (!playerTwo.isPlaying){
        checkGame(playerTwo.cells, "Player Two")
       }
    }, [playerOne.cells, playerTwo.cells])
    
    
    const checkGame = (cellsPlayer, player) => {
        let result = ""
        winCombos.some(combo => {
            checker(cellsPlayer, combo) ? result = "wiin" : "continue"
        })
        console.log(player, result)
    }

   
    useEffect(() => {
        socket.on('info', function (data) {
            setInfo(data);
        });  
        socket.on('game', function (data) {
           // setInfo(data);
          setPlayerOne({cells: data.playerA.cells , isPlaying: data.playerA.isPlaying})
          setPlayerTwo({cells: data.playerB.cells , isPlaying: data.playerB.isPlaying})
          setCells(data.cells)  
          setStartPlay(data.startPlay)
          setMovingPlayerId(data.movingPlayerId)
          console.log(data)
        });  
       // socket.on('connect', onConnect);
    }, [])
    

    return (
        <>
            <h3>
               {/*  Player: */}
               {info}
            </h3>
            {/* <p>
                {playerOne.isPlaying && <span>playerOne</span>}
                {playerTwo.isPlaying && <span>playerTwo</span>}
            </p> */}
            <table>
                <tbody>
                {cells.length > 0 && cells.map((c,i) => {
                    if(i % 3 === 0){
                    return <tr key={cells[i].id}>
                        <td onClick={() => clickCell(cells[i].id)}>{cells[i].value}</td>
                        <td onClick={() => clickCell(cells[i+1].id)}>{cells[i+1].value}</td>
                        <td onClick={() => clickCell(cells[i+2].id)}>{cells[i+2].value}</td>
                    </tr>
                    }
                })}
                </tbody>
            </table>
        </>
    )
}


export default Game