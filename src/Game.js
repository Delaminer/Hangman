import React from 'react';
import { Guesses } from './Guesses.js';
import { Keyboard } from './Keyboard';
import { Lives } from './Lives.js';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
        };

        //Get list of words asynchronously
        this.getWords()
        .then(words => {
            //Save the list of words for later access
            this.words = words;
            // this.analyzeWords(words);
            
            let word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();

            //Some characters are not letters, so provide them
            let given = ['-'];

            //Set the state
            this.setState({
                ready: true,
                lives: 7,
                guesses: given,
                word: word,
                status: 0, //0: playing, 1: won, 2: lost
            });
        })
    }

    restart() {
        //Get a new word
        let word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
        let given = ['-'];

        this.setState({
            ready: true,
            lives: 7,
            guesses: given,
            word: word,
            status: 0, //0: playing, 1: won, 2: lost
        })
    }

    normalize(list) {
        let sum = 0;
        for (let entry of list) {
            sum += entry;
        }
        return list.map(entry => entry / sum);
    }
    analyzeWords(words) {
        let lengths = new Array(100).fill(0);
        let percents = new Array(100).fill(0);

        let vowelList = 'aeiouy';
        for(let word of words) {
            if (lengths[word.length] == undefined) lengths[word.length] = 0;
            lengths[word.length]++;

            let vowels = 0, consonant = 0;
            for(let letter of word) {
                if (vowelList.includes(letter)) {
                    vowels++;
                }
                else {
                    consonant++;
                }
            }
            let percent = Math.floor(100.0 * vowels / word.length);
            if (percents[percent] == undefined) percents[percent] = 0;
            percents[percent]++;
        }
        console.log('PERCENTS')
        console.log(percents);
        console.log(this.normalize(percents));
        console.log('LENGTHS')
        console.log(lengths);
        console.log(this.normalize(lengths));
    }

    /**
     * Get a list of words (or phrases) for using
     * @returns {Promis} An promise to return the list of words. Use .then on this to get the list
     */
    getWords() {
        //There are multiple lists of words, each in separate files, so read each one and add it to the master list
        let wordLists = ['/nouns.txt', '/adjectives.txt'];

        return Promise.all(
            wordLists.map(list => fetch(list)
            .then(response => response.text())
            .then(words => {
                //Remove /r (carriage return) and split it by lines (expecting one word/phrase per line)
                return words.replace(/\r/g, '').split('\n');
            }))
        )
        .then(lists => {
            //lists is an array of arrays (each array is from a separate file), so flatten it into one array
            return [].concat(...lists)
        })
    }

    makeGuess(letter) {
        //You can only play if you have lives left
        if (this.state.lives <= 0) return;

        if (!this.state.guesses.includes(letter)) {
            if (this.state.word.includes(letter)) {
                //Correct guess. Because the guess is added anyway, nothing happens here.
                console.log('It has ' + letter + '!');
            }
            else {
                //State does not update syncronously, so the old state must be used to detect a loss
                let newLives = this.state.lives - 1;

                //Incorrect guess
                console.log('There is no ' + letter + '.');
                //Decrease lives by 1
                this.setState({
                    lives: newLives,
                });

                //Check for game over state (ran out of lives)
                if (newLives <= 0) {
                    //Game over!
                    console.log('Game over! The word was '+this.state.word)
                    this.setState({
                        status: 2,
                    });
                }
            }
            //State does not update syncronously, so the old state must be used to detect a win
            let newGuesses = this.state.guesses.concat([letter]);
            //Add the guess to the state
            this.setState({
                guesses: newGuesses,
            });

            //Check for win state by getting all characters that have not been guessed
            if (this.state.word.split('').filter(char => !newGuesses.includes(char)).length <= 0) {
                //You win!
                console.log('You win! The word was '+this.state.word)
                this.setState({
                    status: 1,
                });
            }
        }
        else {
            console.log('Already guessed ' + letter);
        }
    }

    capital(word) {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    }
    upper(word) {
        return word.toUpperCase();
    }
    lower(word) {
        return word.toLowerCase();
    }

    render() {
        if (!this.state.ready) return 'Loading...'
        let message = '';
        let bg = 'white';
        if (this.state.status === 1) {
            message = 'You won!';
            bg = 'lightgreen';
        }
        if (this.state.status === 2) {
            message = 'You lost!';
            bg = 'lightpink';
        }

        return (
            <div className='container' style={{backgroundColor: bg}}>
                <div style={{flex: '3'}}>
                    <div className='status'>
                        {message}
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button 
                            className='restart' 
                            onClick={() => this.restart()}
                            hidden={this.state.status === 0}
                        >
                            Play Again
                        </button>
                    </div>
                </div>
                <div style={{flex: '5'}}>
                    <Lives 
                        lives={this.state.lives}
                    />
                </div>
                <div style={{flex: '2'}}>
                    <Guesses 
                        word={this.state.word} 
                        guesses={this.state.guesses}
                        status={this.state.status}
                    />
                </div>
                <div style={{flex: '5'}}>
                    <Keyboard 
                        onClick={letter => this.makeGuess(letter)} 
                        word={this.state.word} 
                        guesses={this.state.guesses} 
                    />
                </div>
            </div>
        );
    }
}

export { Game };