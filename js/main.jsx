import React from 'react';
import {

    Redirect,

} from 'react-router-dom';

import './../sass/main.scss'




export default class Main extends React.Component {
    state = {
        numberOfPeopleRecords: [],
        numberOfTimeRecords: [],
        redirectPeople: false,
        redirectList: false,
    }
    urlPeople = 'http://localhost:3000/people/'
    urlTime = 'http://localhost:3000/recent/'



    clearDB = () => {
        console.log( this.state.numberOfTimeRecords)
        console.log( this.state.numberOfPeopleRecords)

        for (let i = 0; i < this.state.numberOfPeopleRecords.length+1; i++) {
            fetch(this.urlPeople + this.state.numberOfPeopleRecords[i], {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json());
        }
        for (let i = 0; i < this.state.numberOfTimeRecords.length + 1; i++) {
            fetch(this.urlTime + this.state.numberOfTimeRecords, {
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
                let idList = []
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].id;
                    idList.push(element)
                }
                this.setState({
                    numberOfTimeRecords: idList
                })
                console.log(this.state.numberOfTimeRecords, 'time')
            })
        fetch(this.urlPeople, )
            .then(resp => resp.json())
            .then(data => {
                let idList = []
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].id;
                    idList.push(element)
                }
                this.setState({
                    numberOfPeopleRecords: idList
                })
                console.log(number, 'people')
            })
    }

    addNew = () => {
        this.setState({
            redirectPeople: true
        })
    }

pick = ()=>{
    this.setState({
        redirectList: true
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
        const { redirectPeople } = this.state
        const { redirectList } = this.state

        if (redirectPeople) {
            return <Redirect to='/entry/people' />;
        }
        if (redirectList) {
            return <Redirect to='/start' />;
        }
        return (
        
        
   
        <div className="lower">
            <video autoPlay loop id="video-background" muted playsInline>
                <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4" />
            </video>
            <div>
            <div><button type="submit" onClick={this.addNew} className="startBtn1 next1">Add New </button></div>
            <div><button type="submit" onClick={this.pick} className="startBtn1 next1">Pick from the list </button></div>
          
                <button className="buttonRemove " onClick={this.clearDBQuestion} mouseover={this.reset}>
                    <div className="icon">
                        <i className="fa fa-trash-o"></i>
                        <i className="fa fa-question"></i>
                        <i className="fa fa-check"></i>
                    </div>
                    <div className="text">
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



