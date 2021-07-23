import React from 'react';
// import { Text, View } from 'react-native';

//Show blanks and what you have guessed correctly ( A _ _ L _ )
class Guesses extends React.Component {
    displayProgress(word, guesses, inGame) {
        //If you are in the game, leftover letters are blanks.
        //If you lost the game, leftover blanks are the letter in red.
        let j = 0;
        const leftover = letter => inGame? '_' : <span style={{color: 'red', textDecorationLine: 'underline'}} key={j++}>{letter}</span>

        let display = [];
        word.split('').forEach((char, i) => {
            display.push(guesses.includes(char)? char : leftover(char));
            if (i != word.length - 1) {
                display.push(' ')
            }
        });
        return display;
    }

    render() {
        return (
            <div 
                className='guesses'
                style={{paddingLeft: 5, paddingRight: 5}}
                // adjustsFontSizeToFit
                // numberOfLines={1}
            >
                {this.displayProgress(this.props.word, this.props.guesses, this.props.status == 0)}
            </div>
        );
    }
}

export { Guesses };