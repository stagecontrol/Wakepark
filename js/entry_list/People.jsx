import './../../sass/people.scss'
import './../../sass/main.scss'

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input'
import DeleteIcon from '@material-ui/icons/Delete';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from './../appBar.jsx'
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
    Redirect
} from 'react-router-dom'


export default class People extends React.Component {
    state = {
        number: [],
        names: [],
        redirect: false
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
        console.log(this.state.number)

    }
    // remove = (p)=>{
    //         const newList = this.state.number.slice()
    //         const num = p-1
    //         console.log(p)
    //         newList.splice(num, 1)


    //         const newList2 = this.state.names.slice()
    //         const num2 = p-1
    //         newList2.splice(num, 1)
    //         this.setState({
    //             number: newList
    //         })
    // }

    name = (e) => {
        const newList = this.state.names.slice()
        const name = e.target.value
        const index = e.target.name - 1
        newList.splice(index, 1, name)
        console.log(newList)
        this.setState({
            names: newList
        })
    }

    namesPost = (p) => {
        const index = p
        const url = 'http://localhost:3000/people'
        const item = this.state.names[index - 1]
        const obj = { name: item }
        console.log(item)

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
            .then(function () {
                return <Redirect to='/entry/time' />;
            })
    }
    namesPost2 = (e) => {
        e.preventDefault()
        const url = 'http://localhost:3000/people'
        for (let i = 0; i < this.state.names.length; i++) {
            const element = this.state.names[i];
            const obj = { name: element }
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

    render() {
        console.log(this.state.number)
        const People = this.state.number.map(p =>
            <div key={p}>
                <Input placeholder="Podaj imię" name={p} onChange={this.name} className="input"></Input>
            </div>)


        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/entry/time' />;
        }

     

        return (


            <div>
            
                <video autoPlay loop id="video-background" muted plays-inline>
                    <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4"/>
                        </video>
                        {/* <AppBar/> */}
                        
                        <div  className="central_box">
                    <div>
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
                    <button type="submit" onClick={this.namesPost2} class="startBtn1 next1">
                        
                        Next
                        
                        </button>
            </div>

                )
            }
        }
        
{/* <Button variant="fab" mini color="primary" aria-label="add" onClick={this.remove.bind(this, p)}> <DeleteIcon /></Button> */}
                {/* <Button onClick={this.namesPost.bind(this, p)} id={p}>Dodaj</Button> */}