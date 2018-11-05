import timer from './../sass/timer.scss'
import React from 'react';





export default class Timer extends React.Component {
    state = {
        recentId: 0,
        name: [],
        timeSetup: [],
        round: 0,
        currentTime: [],
        currentRound: 0,
        show: false,
        time: 0,
        timePerPerson: [],
        newTimePerPerson: [],
        pauseTime: 0,
        paused: undefined,
        resumed: undefined,
        firstUse: true,
        index: 0,
        personId: 0,
        rounds: 0,
        realTime: 45000 //mnożnik do ustalania czasu. wlasciwa wartosc = 60 000
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
        const idUrl = 'http://localhost:3000/recent/'
        const url = 'http://localhost:3000/people/'

        function mainList(){
            fetch(url + this.state.recentId)
                    .then(resp => {
                        if (resp.ok) {
                            return resp.json()
                        } else {
                            throw new Error('Blad sieci!');
                        }
                    })
                    .then(data => {
                        console.log(data)
                        const newNameList = []
                        const newTimeList = []
                        const newTimeSetup = []
                        const newtimePerPerson = []
                        let newRounds = 0
                        for (let i = 0; i < data.names.length; i++) {
                            let name = data.names[i].name;
                            let time = data.names[i].time
                            let id = data.names[i].number
                            let round = Number(data.names[i].time)
                            let timeSetup = []

                            let timePerPerson = 60 / data.names.length * this.state.realTime
                            if (data.names.length == 1) {
                                time = 60
                            } else{
                                time = 60 / data.names.length
                                let remainder = time % data.names[i].time

                                for (let j = 0; j < data.names[i].time; j++) {
                                    if(j < data.names[i].time-1){
                                        timeSetup.push(Math.floor(time / data.names[i].time)) 
                                    }else{
                                        timeSetup.push(Math.floor(time / data.names[i].time)+remainder) 

                                    }
                                    }
                                }

                            

                            let obj = { name: name, time: timeSetup, period: time, rounds: round, timeSpent: 0, currentRound:0, id: id }
                            console.log(obj)
                            let timePerPersonObj = { time: timePerPerson, id: id }
                            newNameList.push(name)
                            newTimeSetup.push(obj)
                            newtimePerPerson.push(timePerPersonObj)
                            newRounds = newRounds + round
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
                    })
                
                
                    .catch(err => console.log(err)); 
        }


        fetch(idUrl)
            .then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw new Error('Blad sieci!');
                }
            })
            .then(data => {
                this.setState({
                    recentId: data[0].id
                },
                mainList
                )

            })
        }

    start = (e) => {
                    let text = e.target.innerText == "START" ? "PAUSE" : "START"
                    e.target.innerText = text
                    if (e.target.classList.contains('firstUse')) {
                        e.target.classList.remove('firstUse')
                        e.target.classList.add('running')
                        this.setState({
                            show: true,
                            end: false

                        })


                    } else if (e.target.classList.contains('running') && this.state.firstUse == false) {
                        e.target.classList.remove('running')
                        e.target.classList.add('paused')

                    } else if (e.target.classList.contains('paused')) {
                        e.target.classList.remove('paused')
                        e.target.classList.add('running')
                    }



                    if (e.target.classList.contains("paused")) {
                        this.setState({
                            paused: true,
                            resumed: false,
                            firstUse: false,
                            show: true


                        })


                    } else if (e.target.classList.contains("running")) {
                        this.setState({
                            paused: false,
                            resumed: true,
                            firstUse: false,

                        })

                    }
                    this.timer()
                    this.timerResumed()

                }


    timer = () => {
                    // let index = this.state.index
                    //pierwsze uruchomienie
                    if (this.state.firstUse == true && this.state.paused == undefined && this.state.running == undefined) {
                        const currentTimeObj = { time: this.state.timeSetup[this.state.index].time[this.state.round] * this.state.realTime, id: this.state.timeSetup[this.state.index].id }
                        this.speakStart()
                        this.setState({
                            currentTime: currentTimeObj
                        })
                        let roundTime = this.state.timeSetup[this.state.index].time[this.state.timeSetup[this.state.index].currentRound] * this.state.realTime 

                        let personId = 0
                        let counter = 0
                        
                        this.id = setInterval(() => {
                            let index = this.state.index
                            

                            if (roundTime > 0) {
                                
                                for (let i = 0; i < this.state.timePerPerson.length; i++) {
                                    let element = this.state.timePerPerson[i].id;
                                    if (element == this.state.timeSetup[index].id) {
                                        personId = element
                                        this.setState({
                                            personId: element
                                        })
                                    }
                                }

                                let period = this.state.timePerPerson[personId - 1].time
                                let change = period - 1000
                                let newList = this.state.timePerPerson.concat()
                                newList[personId - 1] = { time: change, id: personId }
                                this.setState({
                                    currentTime: { time: this.state.currentTime.time - 1000, id: this.state.timeSetup[index].id },
                                    timePerPerson: newList
                                })
                                roundTime -= 1000

                            }
                            else{
                                let name = this.state.timeSetup[this.state.index].name
                                let updatedtimeSetup =this.state.timeSetup.concat()
                                for (let i = this.state.index+1; i < updatedtimeSetup.length; i++) {
                                    
                                    const element =  this.state.timeSetup[i].name;
                                    if(name === element){
                                        updatedtimeSetup[i].currentRound +=1
                                    }
                                }
                                console.log(updatedtimeSetup)
                                this.setState({
                                    
                                    round: this.state.round + 1,
                                    index: this.state.index + 1,
                                    timeSetup: updatedtimeSetup
                                })
                                if (index == this.state.rounds) {
                                    clearInterval(this.id);
                                    this.setState({
                                        end: true
                                    })

                                } else {
                                    roundTime = this.state.timeSetup[this.state.index].time[this.state.timeSetup[this.state.index].currentRound] * this.state.realTime
                                    this.setState({
                                        currentTime: { time: roundTime, id: this.state.timeSetup[this.state.index].id }
                                    })
                            }
                        }


                    
                                if (index == this.state.rounds) {
                                    clearInterval(this.id);
                                    this.setState({
                                        end: true
                                    })

                                } else {
                                    // roundTime = this.state.timeSetup[index].time[this.state.round] * 1000
                                    this.setState({
                                        currentTime: { time: roundTime, id: this.state.timeSetup[this.state.index].id }
                                    })
                                }

                            
                            if (this.state.currentTime.time === 120000) {
                                this.speakPrepare(this.state.timeSetup[index + 1].name)
                            }
                            if (this.state.currentTime.time === 10000) {
                                this.speakChange(this.state.timeSetup[index + 1].name)
                            }
                            if (this.state.paused) {
                                this.setState({
                                    pauseTime: this.state.currentTime.time
                                })
                                clearInterval(this.id)
                            }
                        }, 1000)
                    }
                }
    timerResumed = () => {

                    if (this.state.paused == true) {
                        let roundTime = this.state.pauseTime
                        console.log(roundTime)
                        let personId = 0
                        let index = this.state.index



                        let counter = 0
                        
                        this.id2 = setInterval(() => {
                            let index = this.state.index
                            counter +=1

                            if (roundTime > 0) {
                                
                                for (let i = 0; i < this.state.timePerPerson.length; i++) {
                                    let element = this.state.timePerPerson[i].id;
                                    if (element == this.state.timeSetup[index].id) {
                                        personId = element
                                        this.setState({
                                            personId: element
                                        })
                                    }
                                }

                                let period = this.state.timePerPerson[personId - 1].time
                                let change = period - 1000
                                let newList = this.state.timePerPerson.concat()
                                newList[personId - 1] = { time: change, id: personId }
                                this.setState({
                                    currentTime: { time: this.state.currentTime.time - 1000, id: this.state.timeSetup[index].id },
                                    timePerPerson: newList
                                })
                                roundTime -= 1000

                            }
                            else{
                                let name = this.state.timeSetup[this.state.index].name
                                let updatedtimeSetup =this.state.timeSetup.concat()
                                for (let i = this.state.index+1; i < updatedtimeSetup.length; i++) {
                                    
                                    const element =  this.state.timeSetup[i].name;
                                    if(name === element){
                                        updatedtimeSetup[i].currentRound +=1
                                    }
                                }
                                console.log(updatedtimeSetup)
                                this.setState({
                                    
                                    round: this.state.round + 1,
                                    index: this.state.index + 1,
                                    timeSetup: updatedtimeSetup
                                })
                                if (index == this.state.rounds) {
                                    clearInterval(this.id);
                                    this.setState({
                                        end: true
                                    })

                                } else {
                                    roundTime = this.state.timeSetup[this.state.index].time[this.state.timeSetup[this.state.index].currentRound] * this.state.realTime
                                    this.setState({
                                        currentTime: { time: roundTime, id: this.state.timeSetup[this.state.index].id }
                                    })
                            }
                        }


                    
                                if (index == this.state.rounds) {
                                    clearInterval(this.id);
                                    this.setState({
                                        end: true
                                    })

                                } else {
                                    // roundTime = this.state.timeSetup[index].time[this.state.round] * 1000
                                    this.setState({
                                        currentTime: { time: roundTime, id: this.state.timeSetup[this.state.index].id }
                                    })
                                }

                            
                            if (this.state.currentTime.time === 120000) {
                                this.speakPrepare(this.state.timeSetup[index + 1].name)
                            }
                            if (this.state.currentTime.time === 10000) {
                                this.speakChange(this.state.timeSetup[index + 1].name)
                            }
                            if (this.state.paused) {
                                this.setState({
                                    pauseTime: this.state.currentTime.time
                                })
                                clearInterval(this.id2)
                            }
                        }, 1000)
                    }
                    //czyszczenie jeżeli state jest 'paused'
                    if (this.state.paused == false) {
                        console.log('2 pauza działa')
                        this.setState({
                            pauseTime: this.state.currentTime.time
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
                    msg.lang = "pl-PL"
                    msg2.lang = "pl-PL"
                    window.speechSynthesis.speak(msg);
                    window.speechSynthesis.speak(msg2);
                }

    speakPrepare = (props) => {
                    let msg = new SpeechSynthesisUtterance(props + "masz dwie minuty do startu.");
                    let msg2 = new SpeechSynthesisUtterance("                        ")
                    let msg3 = new SpeechSynthesisUtterance("Rozpocznij przygotowania")
                    msg.rate = 0.8;
                    msg.pitch = 1;
                    msg.lang = "pl-PL"
                    msg2.lang = "pl-PL"
                    msg3.lang = "pl-PL"
                    window.speechSynthesis.speak(msg);
                    window.speechSynthesis.speak(msg2);
                    window.speechSynthesis.speak(msg3);
                }
    speakChange = (props) => {
                    let msg = new SpeechSynthesisUtterance("Zmiana" + props + "zaczynasz.");
                    let msg2 = new SpeechSynthesisUtterance("                        ")
                    let msg3 = new SpeechSynthesisUtterance("Przyjemnej jazdy. ")
                    let msg4 = new SpeechSynthesisUtterance("                        ")
                    msg.lang = "pl-PL"
                    msg2.lang = "pl-PL"
                    msg3.lang = "pl-PL"
                    msg4.lang = "pl-PL"
                    msg5.lang = "pl-PL"
                    msg.rate = 0.8;
                    msg.pitch = 1;
                    window.speechSynthesis.speak(msg);
                    window.speechSynthesis.speak(msg2);
                    window.speechSynthesis.speak(msg3);
                    window.speechSynthesis.speak(msg4);
                    window.speechSynthesis.speak(msg5);
                }


    render() {



                    if(this.state.timeSetup.length == 0) {
            return null
        }

        let widthStyle = {
            width: 1000 / this.state.names.length,
        }


        const list = this.state.names.map(p =>

            <th className="currentUser" style={{ width: 1000 / this.state.names.length }} on>{p}</th>

        )
        const timeLeft = this.state.timePerPerson.map(p =>

            <th className="timeLeft" style={widthStyle}>{this.numberToTime(p.time)}</th>



        )

        const showDiv = () => {

            const time = this.numberToTime(this.state.currentTime.time)
            const currentTime = <div>{time}</div>
            let name = ''
            if (this.state.timeSetup.length > this.state.round) {
                name = <div>{this.state.timeSetup[this.state.round].name}</div>
            } else {
                name = <div className="name">Koniec Kolejki</div>
            }


            let result = (props) => {
                return (<div id="clock" >
                    <div><p className="time">{currentTime}</p></div>
                    <div className="name">{name}</div>
                    <div className="nameNext">NEXT {props}</div>
                </div>
                )
            }


            if (this.state.show == true && this.state.round + 1 < this.state.rounds) {
                let nameNext = <div>{this.state.timeSetup[this.state.round + 1].name}</div>
                return result(nameNext)


            } else if (this.state.show == true && this.state.round + 1 == this.state.rounds) {

                return result('end')

            } else if (this.state.show == true && this.state.round + 1 > this.state.rounds) {
                return (<div>Koniec</div>)
            }

            else {
                return <div className="pressStart">Press start...</div>
            }
        }

        const date = () => { return <div>{this.state.time}</div> }

        return (
            <div className="" >
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