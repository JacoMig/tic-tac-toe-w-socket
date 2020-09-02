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
    const [gameOver, setGameOver] = useState()

    const clickCell = (id) => {
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

    const playAgain = () => {
        socket.emit('playAgain')
    }

    useEffect(() => {
        socket.on('info', function (data) {
           setInfo(data)
        });  
        socket.on('game', function (data) {
           // setInfo(data);
          setPlayerOne({cells: data.playerA.cells , isPlaying: data.playerA.isPlaying})
          setPlayerTwo({cells: data.playerB.cells , isPlaying: data.playerB.isPlaying})
          setCells(data.cells)  
          setStartPlay(data.startPlay)
          setMovingPlayerId(data.movingPlayerId)
          setGameOver(data.winner)
          console.log(data)
          console.log('Game')
          
        });  
       // socket.on('connect', onConnect);
    }, [])
    

    return (
        <>
            <h3>
               {info}
            </h3>
            {gameOver !== "" &&
                <button onClick={playAgain}>Play Again</button>
            }
            <table>
                <tbody>
                {gameOver === "" && cells.length > 0 && cells.map((c,i) => {
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