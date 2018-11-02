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
export default class Start extends React.Component {

    state = {
        data: [],
        elements: [],
        date: '',
        cD: '',
        hours: [],
        // cH: [],
        people: [],
        peopleForHour: [],
        choosenHour: '',
        redirect: false
    }
    peopleList = (e) => {
        let currentTime = new Date()
        fetch('http://localhost:3000/people')
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    data: data,
                    date: currentTime
                })
                if (this.state.data.length > 0) {
                    this.dataEdit()
                }
            })
    }

    dataEdit() {
        let dates = []
        let hours = []
        let data = this.state.data

        function compare(a, b) {
            if (a.hour < b.hour)
                return -1;
            if (a.hour > b.hour)
                return 1;
            return 0;
        }

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
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

                let queue = { hour: hour, people: names }
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
                queue.push({ hour: hour, people: names })
                hours.push({id:element.id, day: day, hours: queue })
            }

        }
        for (let i = 0; i < hours.length; i++) {
            const element = hours[i].hours;
            element.sort(compare)
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

    checkingReservations = () => {
        console.log(this.state.elements)
        this.setState({
            hours: [],
            people: [],
            peopleForHour: [],
            choosenHour: ''
        }, () => {
            for (let i = 0; i < this.state.elements.length; i++) {
                const element = this.state.elements[i];

                if (element.day === this.state.cD) {
                    console.log(element)
                    let hoursList = []
                    let peopleList = []

                    for (let j = 0; j < element.hours.length; j++) {
                        const element2 = element.hours[j].hour;
                        hoursList.push({id:element.id, hour:element2})
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
    hourOnClick = (e) => {
        let peopleForHour = []
        for (let i = 0; i < this.state.elements.length; i++) {
            const element = this.state.elements[i];
            for (let k = 0; k < element.hours.length; k++) {
                const element2 = element.hours[k];
                if (e.target.value === element2.hour) {
                    console.log(element2)
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
            choosenHour: ({id: e.target.getAttribute('id'), hour: e.target.value})
        })

    }
    clickHandel = () => {
        let url = 'http://localhost:3000/people'
        let obj =this.state.choosenHour
    //     fetch(url, {
    //         method: 'POST',
    //         body: JSON.stringify(obj),
    //         headers: { "Content-Type": "application/json" }
    //     })
    //         .then(function (data) {
    //             console.log('Request success: ', data);
    //         })
    //         .catch(function (error) {
    //             console.log('Request failure: ', error);
    //         })
    //         .then(() => this.setState({ redirect: true }))
    // }
    }
    componentDidMount() {
        this.peopleList()
    }
    render() {
        let visible = ''
        if (this.state.hours.length == 0) {
            visible = 'hidden'
        } else {
            visible = 'reserved_hours'
        }


        let hours = this.state.hours.map(p => <div className='hours'><button className='hourButton' onClick={this.hourOnClick} value={p.hour} id={p.id}>{p.hour}</button></div>)
        let people = this.state.peopleForHour.map(p => <div className='hours'><button className='hourButton' value={p}>{p}</button></div>)

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/entry/time' />;
        }


        return (

            <HashRouter>
                <div>
                    <video autoPlay loop id="video-background" muted plays-inline>
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