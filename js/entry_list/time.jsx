import './../../sass/time.scss'
import './../../sass/main.scss'
import React from 'react';
import Select from '@material-ui/core/Select'
import {
    HashRouter,
    Redirect,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { Input } from '@material-ui/core';
import { FormField, Slider } from 'react-mdc-web/lib'
import InputLabel from '@material-ui/core/InputLabel'
export default class TimeSetup extends React.Component {
    state = {
        names: [],
        list: {
            name: [],
            time: []

        },
        time: 0,
        redirect: false
    }

    loadlist = () => {
        const url = 'http://localhost:3000/people/'
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
                const newList = []
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].name;

                    newList.push(element)
                }
                console.log(newList, 'data')
                this.setState({
                    names: newList,
                })

            })
            .catch(err => console.log(err));
    }
    timeInput = (e) => {

        const time = e.target.value
        const name = e.target.name
        const index = this.state.list.name.indexOf(name)

        const newList = { ...this.state.list }
        if (index !== -1) {
            newList.name[index] = name
            newList.time[index] = time
        } else {
            newList.name.push(name)
            newList.time.push(time)
        }
    }
    submitHandel = (e) => {
        e.preventDefault()
        const url = 'http://localhost:3000/time'
        for (let i = 0; i < this.state.list.name.length; i++) {
            const name = this.state.list.name[i];
            const time = this.state.list.time[i];
            const obj = { name: name, time: time }
            console.log(obj)
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
    }

    componentDidMount() {
        this.loadlist()
    }
    index = (p) => {
        const index = this.state.list.name.indexOf(name)
        return index
    }
    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/App' />;
        }
        const list = this.state.names.map(p =>
            <div key={p}>
                <h3 className="name">{p}</h3>
                {/* <FormField id="discrete-with-markers-slider">
                    <Slider
                        name={p}
                        value={this.state.time}
                        min={1}
                        max={4}
                        step={1}
                        discrete
                        showMarkers
                        onInput={(inputValue) => {
                            const time = inputValue
                            const name = p
                            const index = this.state.list.name.indexOf(p)
                            const newList = { ...this.state.list }
                            console.log("newList",newList)
                            if (index !== -1) {
                                newList.name[index] = name
                                newList.time[index] = time
                            } else {
                                newList.name.push(name)
                                newList.time.push(time)
                            }
                            this.setState({ list: { name: p, time: inputValue } })
                        }}
                    />

                </FormField> */}
                <div>
                    <input type="text" onChange={this.timeInput} name={p} class="input question" id="howMany" required autocomplete="off" />
                    <label for="howMany"><span>Wybierz ilość rund (1-4)</span></label>
                </div>
                {/* <input onChange={this.timeInput} name={p} className="input question" id="howMany" />
                <label for="howMany"><span>Wybierz ilość rund (1-4)</span></label> */}

            </div>)

        console.log(this.state.list)

        return (



            <div className="full">
                <div className="central_box box">
                    <video autoPlay loop id="video-background" muted plays-inline>
                    <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4"/>
                    </video>
                    {list}
                    <div className="next">
                    </div>
                </div>
                <button type="submit" onClick={this.submitHandel} class="startBtn1 next1">NEXT </button>
                
            </div>

        )
    }

}
