import React from 'react'
import ReactDOM from 'react-dom'
import Game from './containers/Game'
import './global.scss'

class App extends React.Component {
    render(){
        return (
            <div>
               <Game />
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'))