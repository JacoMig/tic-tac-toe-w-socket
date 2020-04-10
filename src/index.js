import React from 'react'
import ReactDOM from 'react-dom'
import {Motion, spring} from 'react-motion';

class App extends React.Component {
    render(){
        return (
            <div>
                <Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
                {value => <div>{Math.floor(value.x)}</div>}
                </Motion>
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'))