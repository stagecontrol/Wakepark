import './../sass/main.scss'
import React from 'react';
import {
    HashRouter,

} from 'react-router-dom';
import Calendar from 'react-calendar'
import './../sass/start.scss'
import {
    Redirect
} from 'react-router-dom'
import { addHours} from 'date-fns/fp'
const addOneHour= addHours(1)

export default class Start extends React.Component {
    state = {
        data: [],
        elements: [],
        date: new Date(),
        cD: '',
        hours: [],
        // cH: [],
        people: [],
        peopleForHour: [],
        choosenHour: '',
        redirect: false
    }
    peopleList = (e) => {
        let currentTime = addOneHour(new Date())
        
        console.log(currentTime)
        const url2 = 'http://localhost:3000/recent/'
        fetch(url2)
            .then(resp => {
                console.log(resp)
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw new Error('Blad sieci!');
                }
            })
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].id;
                    fetch(url2 + element, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    })

                }
            })

        fetch('http://localhost:3000/people')
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    data: data,
                    date: currentTime
                })
                if (this.state.data.length > 0) {
                    this.dataEdit()
                    this.onStart()

                }
            })
    }

    dataEdit() {
        let dates = []
        let hours = []
        let data = this.state.data
        let idList = []
        function compare(a, b) {
            if (a.hour < b.hour)
                return -1;
            if (a.hour > b.hour)
                return 1;
            return 0;
        }

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let id = element.id
            let day = element.date.slice(0, 10)
            let hour = element.date.slice(11, 16)
            //if date is already in array
            if (dates.indexOf(day) !== -1) {
                let index2 = 0
                let index = dates.indexOf(day)
                let names = []
                for (let j = 0; j < element.names.length; j++) {
                    const element2 = element.names[j].name;
                    names.push(element2)
                }
                idList.push(id)
                let queue = { hour: hour, people: names, id: id }
                hours[index].hours.splice(index, 0, queue)

            }
            // if it is first apperance
            else {
                dates.push(day)
                let names = []
                let queue = []
                for (let j = 0; j < element.names.length; j++) {
                    const element4 = element.names[j].name;
                    names.push(element4)

                }
                idList.push(id)
                queue.push({ hour: hour, people: names, id: id })
                hours.push({ id: idList, day: day, hours: queue })
            }

        }
        for (let i = 0; i < hours.length; i++) {
            const element = hours[i].hours;
            const element2 = hours[i].id
            element.sort(compare)
            element2.sort(compare)
        }

        this.setState({
            elements: hours
        })
    }
    onChange = (e) => {
        let time = e
        this.setState({
            date: time,
        },

        )
    }

    correctDate = (e) => {
        let newD = e
        newD.setDate(newD.getDate() + 1)
        let string = JSON.stringify(newD)
        let day = string.slice(1, 11)
        this.setState({
            cD: day
        }, () => {
            this.checkingReservations()
        })
    }
    correctDateOnStart = (e) => {
        let newD = e
        newD.setDate(newD.getDate())
        let string = JSON.stringify(newD)
        let day = string.slice(1, 11)
        this.setState({
            cD: day
        }, () => {
            this.checkingReservations()
        })
    }

    checkingReservations = () => {
        this.setState({
            hours: [],
            people: [],
            peopleForHour: [],
            choosenHour: ''
        }, () => {
            for (let i = 0; i < this.state.elements.length; i++) {
                const element = this.state.elements[i];

                if (element.day === this.state.cD) {
                    let hoursList = []
                    let peopleList = []

                    for (let j = 0; j < element.hours.length; j++) {
                        const element2 = element.hours[j].hour;
                        hoursList.push({ id: element.hours[j].id, hour: element2 })
                        peopleList.push(element.hours[j].people)
                    }
                    this.setState({
                        hours: hoursList,
                        people: peopleList

                    })

                }
            }
        })
    }

    onClick = (e) => {
        this.correctDate(e)
    }
    onStart = () => {


        this.correctDateOnStart(this.state.date)
    }
    hourOnClick = (e) => {
        let peopleForHour = []
        for (let i = 0; i < this.state.elements.length; i++) {
            const element = this.state.elements[i];
            for (let k = 0; k < element.hours.length; k++) {
                const element2 = element.hours[k];
                if (e.target.value === element2.hour) {
                    for (let j = 0; j < element2.people.length; j++) {
                        const element3 = element2.people[j];
                        peopleForHour.push(element3)

                    }
                }
            }

        }
        e.target.getAttribute('id')
        this.setState({
            peopleForHour: peopleForHour,
            choosenHour: ({ id: e.target.getAttribute('id'), hour: e.target.value })
        })

    }
    clickHandel = () => {
        let url = 'http://localhost:3000/recent/'
        let obj = { id: this.state.choosenHour.id }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" }
        })
            .then(function (data) {
                console.log('Request success: ', data);
            })
            .catch(function (error) {
                console.log('Request failure: ', error);
            })
        .then(() => this.setState({ redirect: true }))
    }

    componentDidMount() {
        this.peopleList()
    }
    // componentWillUnmount(){
    //     this.peopleList.abort()
    // }
    render() {
        let visible = ''
        if (this.state.hours.length == 0) {
            visible = 'hidden'
        } else {
            visible = 'reserved_hours'
        }


        let hours = this.state.hours.map(p => <div className='hours' key={p.id + 1}><button className='hourButton' onClick={this.hourOnClick} value={p.hour} id={p.id} key={p.id}>{p.hour}</button></div>)
        let people = this.state.peopleForHour.map(p => <div className='hours' key={p.name + 1}><button className='hourButton' value={p} key={p.name}>{p}</button></div>)

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/app' />;
        }


        return (

            <HashRouter>
                <div>
                    <video autoPlay loop id="video-background" muted playsInline>
                        <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4" />
                    </video>
                    <div className='next_to'>
                        <div className="central_box ">
                            <div>
                                <Calendar
                                    onChange={this.onChange}
                                    value={this.state.date}
                                    onClickDay={this.onClick}
                                />

                            </div>

                        </div>
                        <div className={visible} className='next_to'>
                            <div className={visible}>
                                {hours}
                            </div>
                            <div className={visible}>
                                {people}
                            </div>
                        </div>

                    </div>
                    <div className='start'>
                        <button className='startButton' onClick={this.clickHandel}>start {this.state.choosenHour.hour} </button>
                    </div>
                </div>
            </HashRouter>
        )
    }
}