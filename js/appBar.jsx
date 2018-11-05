import './../sass/appBar.scss'
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
// import {H1} from '@material-ui/core/'
export default class AppBar extends React.Component{
state={
    redirect:false
}
Redirect= ()=>{
    console.log('redirect')
    this.setState({
        redirect: true
    })
}
    render(){
        const { redirect } = this.state

        if(redirect){
            return <Redirect to='/'/>
        }
        return(
            <div className="appBar">
                <div className="logo" onClick={this.Redirect}>
                
                </div>
                <div className="title">
                <h1>WAKE TIMER</h1>
                </div>
            </div>
        )
    }
}