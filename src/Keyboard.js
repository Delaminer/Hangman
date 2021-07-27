import React from 'react';
// import { Text, View, TouchableOpacity } from 'react-native';

//Custom keyboard and letters

//Define letter
class Letter extends React.Component {
    
    render() {
        return (
            <div className='letterBase'>
                <button 
                    className={`letter ${this.props.status}`}
                    onClick={this.props.onClick} 
                    disabled={this.props.disabled}
                >
                        {this.props.value}
                </button>
            </div>
        );
    }
}

//Define keyboard
class Keyboard extends React.Component {
    renderLetter(value) {
        let status = 'enabled';
        if (this.props.guesses.includes(value)) {
            status = this.props.word.includes(value) ? 'correct' : 'incorrect';
        }
        
        return (
            <Letter 
                value={value} 
                key={value}
                onClick={() => this.props.onClick(value)}
                disabled={this.props.guesses.includes(value)}
                status = {status}
            />
        );
    }

    render() {
        //How many letters per row
        const rowLengths = [7, 7, 6, 6];
        let keyboard = [];
        let i = 0;
        for(let row in rowLengths) {
            let letterRow = [];
            for(let j = 0; j < rowLengths[row]; j++) {
                letterRow.push(this.renderLetter(String.fromCharCode(65 + i)));
                i++;
            }
            keyboard.push(
                <div className='keyboardRow' key={row}>
                    {letterRow}
                </div>
            );
        }

        return (
            <div className='keyboard'>
                {keyboard}
            </div>
        );
    }
}

export { Keyboard };