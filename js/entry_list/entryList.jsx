import './../../sass/main.scss'
import React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import People from './People.jsx'
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';
import TimeSetup from './Time.jsx'
export default class EntryList extends React.Component {

    state = {

    }
    peopleList = (e) => {
        e.preventDefault()
        console.log(e.target.value)
    }
    nameTemp = (e) => {

    }
    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/entry/people/"
                        render={props => <People name={this.nameTemp} peopleList={this.peopleList} />} />
                    <Route path="/entry/time"
                        render={props => <TimeSetup  />} />

                </div>
            </HashRouter>
        )
    }
}