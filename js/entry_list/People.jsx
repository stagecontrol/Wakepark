import './../../sass/people.scss'
import './../../sass/main.scss'

import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input'
import Time from './timePicker.jsx';
import {
    Redirect
} from 'react-router-dom'
import moment from 'moment'
import { addHours} from 'date-fns/fp'
const addOneHour= addHours(1)


export default class People extends React.Component {

    state = {
        list: [],
        number: [],
        names: [],
        element:[],
        selectedDate: new Date(),
        redirect: false
    }
    loadlist = () => {
        const url = 'http://localhost:3000/temporary/'
        fetch(url)
            .then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw new Error('Blad sieci!');
                }
            })
            .then(data => {
                this.setState({
                    list: data,
                })

            })
            .catch(err => console.log(err));
    }
    addNew = () => {
        const newList = this.state.number.slice()
        const num = this.state.number.length + 1
        newList.push(num)

        const newList2 = this.state.names.slice()
        const num2 = this.state.names.length + 1
        newList2.push(num2)
        this.setState({
            number: newList,
            names: newList2
        })
    }


    name = (e) => {
        const newList = this.state.names.slice()
        const name = e.target.value
        const index = e.target.name - 1
        newList.splice(index, 1, name)
        this.setState({
            names: newList
        })
    }

    date = (date) => {
        // date = addOneHour(date)
        for (let i = 0; i < this.state.list.length; i++) {

            const element = this.state.list[i].date;
            let dateJSON = JSON.stringify(date)
            let correctData = dateJSON.slice(1, 17)
            let correctInput = element.slice(0, 16)
            console.log(correctInput, correctData)
            if(correctInput == correctData){
                alert('Godzina jest zajęta, wybierz inną!!')
            }
        }
        this.setState({ selectedDate: date });
      }

    finalElement = (e)=>{
        let names = []
        let element = {}
        let random = Math.random()
        const date = addOneHour(this.state.selectedDate)
        element = {id: random, date:date, names: names}
        for (let i = 0; i < this.state.names.length; i++) {
            const name = this.state.names[i];
            const number = this.state.number[i]
            let obj = {name: name, number: number}
            names.push(obj)
        }
    this.namesPost2(e, element)
    }
    
    namesPost2 = (e, names) => {
        e.preventDefault()
        const url = 'http://localhost:3000/temporary/'
        const url2 = 'http://localhost:3000/recent/'
        let obj = names
        let id = {id:obj.id}
        for (let i = 0; i < this.state.list.length; i++) {
        const element = this.state.list[i].id;
        fetch(url+element, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
    }
    //deleting recent
    fetch(url2)
    .then(resp => {
        console.log(resp)
        if (resp.ok) {
            return resp.json()
        } else {
            throw new Error('Blad sieci!');
        }
    })
    .then(data=>{
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            const element = data[i].id;
            fetch(url2+element, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
        }
    })   
//

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
                
            fetch(url2, {
                method: 'POST',
                body: JSON.stringify(id),
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





componentDidMount(){
    this.loadlist()
}
    render() {
        console.log(this.state.selectedDate)
        const People = this.state.number.map(p =>
            <div key={p}>
                <Input placeholder="Podaj imię" key={p} onChange={this.name} className="input" autoFocus></Input>
            </div>)


        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/entry/time' />;
        }

     

        return (


            <div>

                <video autoPlay loop id="video-background" muted playsInline>
                    <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4"/>
                        </video>
         
                        <div  className="central_box">
                    <div>
                          <div className='time'>
                            <Time  date={this.date} selected={this.state.selectedDate}/>
                        </div>
                        {People}
                    </div>
                    <div className="addNew">
                        <button onClick={this.addNew} className="startBtn1">
                            <AddIcon />
                        </button>
                    </div>
                    <div >

                    </div>

                    </div>
                    <button type="submit" onClick={this.finalElement} className="startBtn1 next1">
                        
                        Next
                        
                    </button>
            </div>

                )
            }
        }
        
