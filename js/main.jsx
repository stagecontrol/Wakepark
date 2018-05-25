import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter,
    Redirect,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import Portal from '@material-ui/core/Portal';

//components 
import EntryList from './entry_list/entryList.jsx'
import Timer from './Timer.jsx'
import Speak from './speak.jsx'
import AppBar from './appBar.jsx';



export default class Main extends React.Component {
    state = {
        numberOfPeopleRecords: 0,
        numberOfTimeRecords: 0,
        redirect: false
    }
    urlPeople = 'http://localhost:3000/people/'
    urlTime = 'http://localhost:3000/time/'



    clearDB = () => {


        for (let i = 1; i < this.state.numberOfPeopleRecords + 1; i++) {
            fetch(this.urlPeople + i, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json());
        }
        for (let i = 1; i < this.state.numberOfTimeRecords + 1; i++) {

            fetch(this.urlTime + i, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json());
        }
    }
    loadList = () => {
        fetch(this.urlTime, )
            .then(resp => resp.json())
            .then(data => {
                const number = data.length
                this.setState({
                    numberOfTimeRecords: number
                })
                console.log(this.state.numberOfTimeRecords, 'time')
            })
        fetch(this.urlPeople, )
            .then(resp => resp.json())
            .then(data => {
                const number = data.length
                this.setState({
                    numberOfPeopleRecords: number
                })
                console.log(number, 'people')
            })
    }

    addNew = () => {
        this.setState({
            redirect: true
        })
    }



    clearDBQuestion = (e) => {

        if (e.target.classList.contains("confirm")) {
            e.target.classList.add("done");
            e.target.innerText = "Deleted";
            this.clearDB()
        } else if (e.target.classList.contains("done")) {
            return null
        } else {
            e.target.classList.add("confirm");
            e.target.innerText = "Are you sure?";
        }
    };

    reset = (e) => {

        if (e.target.classList.contains("confirm") || e.target.classList.contains("done")) {
            setTimeout(function () {
                e.target.classList.remove("confirm")
                e.target.classList.remove("done");
                e.target.innerText = "Delete";
            }, 3000);
        }

    }




    componentDidMount() {
        this.loadList()
    }

    render() {
        const { redirect } = this.state
        if (redirect) {
            return <Redirect to='/entry/people' />;
        }
        return (
        
        
   
        <div class="lower">
            <video autoPlay loop id="video-background" muted plays-inline>
                <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4" />
            </video>
            <div>
            <div><button type="submit" onClick={this.addNew} class="startBtn1 next1">Add New </button></div>
          
                <button class="buttonRemove " onClick={this.clearDBQuestion} mouseover={this.reset}>
                    <div class="icon">
                        <i class="fa fa-trash-o"></i>
                        <i class="fa fa-question"></i>
                        <i class="fa fa-check"></i>
                    </div>
                    <div class="text">
                        <span>Delete</span>
                    </div>
                        
                </button>


            </div>
            <div>
        </div>
                
                
                
            </div>
        )
    }
}



