import timer from './../sass/timer.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Portal from '@material-ui/core/Portal';
import Speak from './speak.jsx'




export default class Timer extends React.Component {
    state = {
        name: [],
        timeSetup: [],
        secondTimeSetup: [],
        round: 0,
        currentTime: 0,
        show: false,
        time: 0,
        timePerPerson: [],
        newTimePerPerson: 0,
        pauseTime: 0,
        paused: undefined,
        resumed: undefined,
        firstUse: true,
        index: 0,
    }
    date = () => {

        this.id = setInterval(() => {
            const element = new Date().toLocaleTimeString()
            this.setState({
                time: element
            })
        }, 1000)

    }
    loadlist = () => {
        const url = 'http://localhost:3000/time/'
        fetch(url)
            .then(resp => {
                if (resp.ok) {
                    return resp.json()
                    console.log(resp)
                } else {
                    throw new Error('Blad sieci!');
                }
            })
            .then(data => {
                const newNameList = []
                const newTimeList = []
                const newTimeSetup = []
                const newtimePerPerson = []
                let newRounds = 0
                for (let i = 0; i < data.length; i++) {
                    let name = data[i].name;
                    let time = data[i].time
                    let round = Number(data[i].time)
                    let timeSetup = []
                    let timePerPerson = 60 / data.length * 6000
                    if (data.length == 1) {
                        time = 60
                    } else {
                        time = 60 / data.length
                        timeSetup = Math.round(time / data[i].time)
                    }
                    let obj = { name: name, time: timeSetup, period: time, rounds: round, timeSpent: 0 }

                    newNameList.push(name)
                    newTimeSetup.push(obj)
                    newtimePerPerson.push(timePerPerson)
                    newRounds = newRounds + round
                    console.log(newtimePerPerson, 'new')
                }
                let stop = false
                const order = []
                while (!stop) {
                    stop = true
                    newTimeSetup.forEach(user => {
                        if (user.rounds > 0) {
                            order.push(Object.assign({}, user))
                            user.rounds = user.rounds - 1
                        }
                        if (user.rounds > 0) {
                            stop = false
                        }

                    });
                }

                this.setState({
                    names: newNameList,
                    time: newTimeList,
                    timeSetup: order,
                    rounds: newRounds,
                    timePerPerson: newtimePerPerson
                })
                console.log(this.state.timePerPerson, 'timePerPerson')
            })
            .catch(err => console.log(err));
    }


    start = (e) => {
        let text = e.target.innerText == "START" ? "PAUSE" : "START"
        e.target.innerText = text
        if (e.target.classList.contains('firstUse')) {
            e.target.classList.remove('firstUse')
            e.target.classList.add('running')
            this.speakStart()
           
        } else if (e.target.classList.contains('running') && this.state.firstUse == false) {
            e.target.classList.remove('running')
            e.target.classList.add('paused')
        } else if (e.target.classList.contains('paused')) {
            e.target.classList.remove('paused')
            e.target.classList.add('running')
        }



        if (e.target.classList.contains("paused") ) {
            this.setState({
                paused: true,
                resumed: false,
                firstUse: false,
                show: true


            }, () => {
                console.log(this.state.resumed, "resumed 1")
                console.log(this.state.paused, "paused 1")
            })


        } else if (e.target.classList.contains("running")) {
            this.setState({
                paused: false,
                resumed: true,
                firstUse: false,
                show: true

            }, () => {
                console.log(this.state.resumed, "resumed 2")
                console.log(this.state.paused, "paused 2");
                
            })

        }
        this.timer()

    }


    timer = () => {

        //pierwsze uruchomienie
        if (this.state.firstUse == true && this.state.paused == undefined && this.state.running == undefined) {

            this.setState({
                currentTime: this.state.timeSetup[this.state.index].time * 6000,
            })
            let roundTime = this.state.timeSetup[this.state.index].time * 6000
            this.id = setInterval(() => {
            let index = this.state.index
                
                console.log('pierwszy interwał')
                if (roundTime > 0) {
                    let period = this.state.timePerPerson[index]
                    let change = period - 1000
                    let newList = this.state.timePerPerson.concat()
                    newList[index] = (change)
                    this.setState({
                        currentTime: this.state.currentTime - 1000,
                        timePerPerson: newList
                    })
                    roundTime = roundTime - 1000
                } else {
                    this.setState({
                        round: this.state.round + 1,
                        index: this.state.index + 1
                    })
                    if (index > this.state.rounds) {
                        clearInterval(this.id);

                    } else {
                        roundTime = this.state.timeSetup[index].time * 6000
                        this.setState({
                            currentTime: this.state.timeSetup[index].time * 6000
                        })
                    }

                }
                if (this.state.currentTime === 280000) {
                    this.speakPrepare(this.state.timeSetup[index + 1].name)
                }
                if (this.state.currentTime === 10000) {
                    this.speakChange(this.state.timeSetup[index + 1].name)
                }
                if (this.state.paused) {
                    this.setState({
                        pauseTime: this.state.currentTime
                    })
                    clearInterval(this.id)

                }
            }, 1000)
        }

        //uruchomienie jeżeli state jest 'resumed'

        if (this.state.paused == true) {
            let roundTime = this.state.pauseTime

            this.id2 = setInterval(() => {
                let index = this.state.index
                if (roundTime > 0) {
                    let period = this.state.timePerPerson[index]
                    let change = period - 1000
                    let newList = this.state.timePerPerson.concat()
                    newList[index] = change
                    this.setState({
                        currentTime: this.state.currentTime - 1000,
                        timePerPerson: newList
                    })
                    roundTime = roundTime - 1000
                    
                } else {
                    
                    this.setState({
                        round: this.state.round + 1,
                        index: this.state.index + 1
                    })
                    if (index > this.state.rounds) {
                        clearInterval(this.id);
                    } else {
                        roundTime = this.state.timeSetup[index].time * 6000
                        this.setState({
                            currentTime: this.state.timeSetup[index].time * 6000
                        })
                    }                 
            

                }
                if (this.state.currentTime === 28000) {
                    this.speakPrepare(this.state.timeSetup[index + 1].name)
                }
                if (this.state.currentTime === 1000) {
                    this.speakChange(this.state.timeSetup[index + 1].name)
                }
            }, 1000)
        }
        //czyszczenie jeżeli state jest 'paused'
        if (this.state.paused == false) {
            console.log('2 pauza działa')
            this.setState({
                pauseTime: this.state.currentTime
            })
            clearInterval(this.id2)
        }


    }

    checkTime = (i) => {
        if (i < 10) { i = "0" + i };
        return i;
    }
    numberToTime = (props) => {

        let seconds = Math.floor((props / 1000) % 60);
        let minutes = Math.floor((props / 1000 / 60) % 60);
        let minutes2 = this.checkTime(minutes)
        let seconds2 = this.checkTime(seconds)
        return minutes2 + ":" + seconds2
    }


    componentDidMount() {
        this.loadlist()
        this.date()

    }

    speakStart = (props) => {
        let msg = new SpeechSynthesisUtterance("Zaczynamy!");
        let msg2 = new SpeechSynthesisUtterance("Miłej zabawy!");
        msg.rate = 0.8;
        msg.pitch = 1;
        lang: "pl-PL"
        window.speechSynthesis.speak(msg);
        window.speechSynthesis.speak(msg2);
    }

    speakPrepare = (props) => {
        let msg = new SpeechSynthesisUtterance(props + "masz dwie minuty do startu.");
        let msg2 = new SpeechSynthesisUtterance("                        ")
        let msg3 = new SpeechSynthesisUtterance("Rozpocznij przygotowania")
        msg.rate = 0.8;
        msg.pitch = 1;
        window.speechSynthesis.speak(msg);
        window.speechSynthesis.speak(msg2);
        window.speechSynthesis.speak(msg3);
    }
    speakChange = (props) => {
        let msg = new SpeechSynthesisUtterance("Zmiana" + props + "zaczynasz.");
        let msg2 = new SpeechSynthesisUtterance("                        ")
        let msg3 = new SpeechSynthesisUtterance("Przyjemnej jazdy. ")
        let msg4 = new SpeechSynthesisUtterance("                        ")
        let msg5 = new SpeechSynthesisUtterance("A tak na marginesie to kursy w coders Lab są super")

        msg.rate = 0.8;
        msg.pitch = 1;
        window.speechSynthesis.speak(msg);
        window.speechSynthesis.speak(msg2);
        window.speechSynthesis.speak(msg3);
        window.speechSynthesis.speak(msg4);
        window.speechSynthesis.speak(msg5);
    }


    render() {
        if (this.state.timeSetup.length == 0) {
            return null
        }
        console.log(this.state.index, 'index')
        
        // console.log(this.state.firstUse, 'firstuse')
        // console.log(this.state.resumed, 'resumed')
        // console.log(this.state.paused, 'paused')
        let widthStyle = {
            width: 1000 / this.state.names.length

        }
        const list = this.state.names.map(p =>

            <th className="currentUser" style={widthStyle}>{p}</th>

        )
        const timeLeft = this.state.timePerPerson.map(p =>

            <th className="timeLeft" style={widthStyle}>{this.numberToTime(p)}</th>



        )

        const showDiv = () => {
            if (this.state.show == true) {
                const time = this.numberToTime(this.state.currentTime)
                const currentTime = <div>{time}</div>
                const name = <div>{this.state.timeSetup[this.state.round].name}</div>
                const nameNext = <div>{this.state.timeSetup[this.state.round + 1].name}</div>

                return (
                    <div id="clock" >
                        <div><p className="time">{currentTime}</p></div>
                        <div className="name">{name}</div>
                        <div className="nameNext">NEXT {nameNext}</div>
                    </div>
                )
            } else {
                return <div className="pressStart">Press start...</div>
            }
        }
        const date = () => { return <div>{this.state.time}</div> }

        return (
            <div className="">
                <div className="central_box App">

                    <video autoPlay loop id="video-background" muted plays-inline>
                        <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4" />
                    </video>

                    <div>{showDiv()}</div>




                    {/* {date()} */}

                </div>
                <div>

                </div>

                <div className="start"><button onClick={this.start} className="startBtn firstUse">START</button></div>

                <div className="table">
                    <div>
                        <table>{list}</table>

                    </div>
                    <div>
                        <table>{timeLeft}</table>
                    </div>
                </div>
            </div>
        )
    }
}