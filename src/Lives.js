import React from 'react';
// import { View } from 'react-native';
// import Svg, {Line, Circle, G, Path} from 'react-native-svg';

//Displays lives and hangman player UI
class Lives extends React.Component {
    getHeart(x) {
        x = x * 50;
        const path = `M 25 396 m ${x} 0 l -20 -20 l 20 20 l 20 -20 a 10,10 90 1,0 -20,-20 a 10,10 90 1,0 -20,20 z`;
        return (
            <g key={x}>
            {/* <G style={this.props.styles.heart} key={x}> */}
                <path d={path}/>
            </g>
        );
    }

    getDrawing(lives) {
        let hearts = [];
        for(let i = 0; i < lives; i++) {
            hearts.push(this.getHeart(i));
        }
        let body = [
            <circle key='head' cx='270' cy='137.5' r='37.5'/>,
            <line key='body' x1='270' y1='175' x2='270' y2='275'/>,
            <line key='left leg' x1='270' y1='275' x2='235' y2='330'/>,
            <line key='right leg' x1='270' y1='275' x2='305' y2='330'/>,
            <line key='left arm' x1='270' y1='225' x2='235' y2='180'/>,
            <line key='right arm' x1='270' y1='225' x2='305' y2='180'/>,
            
            <line key='left eye 1' x1='245' y1='135' x2='260' y2='120'/>,
            <line key='left eye 2' x1='260' y1='135' x2='245' y2='120'/>,

            <line key='right eye 1' x1='295' y1='135' x2='280' y2='120'/>,
            <line key='right eye 2' x1='280' y1='135' x2='295' y2='120'/>,

            <circle key='mouth' cx='270' cy='156.25' r='10'/>
        ];
        //Only show some of the body, but show all of it when the game is over
        if (lives > 0) {
            //Only show some
            let partsToShow = 7 - lives;
            body = body.filter((v, i) => i < partsToShow);
        }
        return (
            <svg 
                className='drawing'
                stroke='black'
                strokeWidth='2'
                fill='none'
                viewBox='0 0 400 400'
            >
                <line x1='50' y1='350' x2='150' y2='350'/>
                <line x1='100' y1='50' x2='100' y2='350'/>
                <line x1='100' y1='50' x2='270' y2='50'/>
                <line x1='270' y1='100' x2='270' y2='50'/>

                {body}
                <g stroke='none' fill='red'>
                    {hearts}
                </g>
            </svg>
        );
    }

    render() {
        return (
            <div className='lives'>
                {this.getDrawing(this.props.lives)}
            </div>
        );
    }
}

export { Lives };