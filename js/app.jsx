import './../sass/main.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter,
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
import Start from './start.jsx'
import Main from './main.jsx'
import AppBar from './appBar.jsx'
document.addEventListener('DOMContentLoaded', function () {
    class App extends React.Component {

        render() {
            return (
                <HashRouter>
                    <div className="work_please">
                        <AppBar />
                        <div className="full">
                            <Route exact path="/" component={Main} className='full' />
                            <Route path="/entry" component={EntryList} className='full' />
                            <Route path="/start" component={Start} className='full' />
                            <Route path="/App" component={Timer} />
                        </div>
                    </div>
                </HashRouter>

            )
        }
    }
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );

});
