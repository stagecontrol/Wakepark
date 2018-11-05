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

export default class TimeSetup extends React.Component {
    state = {
        data:[],
        names: [],
        list: {
            name: [],
            time: [],
            order:0,

        },
        time: [],
        redirect: false,
        redirect2: false,
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
                console.log(data)
                let length = data.length - 1
                const newList = []

                const element = data[length].names;
                const order = data[length].id
                for (let j = 0; j < element.length; j++) {
                    const element2 = element[j].name;
                    newList.push(element2)
                }

                console.log(newList, 'data')
                this.setState({
                    data: data,
                    names: newList,
                    order: order
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
        console.log(this.state.list)
    }
    submitHandel = (e) => {
        e.preventDefault()
        const url= 'http://localhost:3000/people/'
        const url2= 'http://localhost:3000/recent/'
        const url3= 'http://localhost:3000/temporary/'

        let times = this.state.list.time
        for (let i = 0; i < this.state.data[0].names.length; i++) {
        const element = this.state.data[0].names[i];
        console.log(element)
        element.time = times[i]
        }
        const obj = this.state.data[0]
        const id = {id:this.state.data[0].id}
//leaving current id in 'recent' db
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
            for (let i = 0; i < data.length; i++) {
                const element = data[i].id;
                if(element !== this.state.data[0].id){
                    fetch(url2+element, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    })
                }
            }
        })
//

//posting object to main db
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: { "Content-Type": "application/json" }
            })
//deleting temoporary object
                fetch(url3 + this.state.data[0].id, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(() => this.setState({ redirect: true }))
        
    }

    submitHandelSave=(e)=>{
        e.preventDefault()
        const url= 'http://localhost:3000/people/'
        const url2= 'http://localhost:3000/recent/'
        const url3= 'http://localhost:3000/temporary/'

        let times = this.state.list.time
        for (let i = 0; i < this.state.data[0].names.length; i++) {
        const element = this.state.data[0].names[i];
        console.log(element)
        element.time = times[i]
        }
        const obj = this.state.data[0]
        const id = {id:this.state.data[0].id}
//deleting id in recent db
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

//posting object to main db
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: { "Content-Type": "application/json" }
            })
//deleting temoporary object
                fetch(url3 + this.state.data[0].id, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(() => this.setState({ redirect2: true }))
        
    }


    componentDidMount() {
        this.loadlist()
    }
    index = (p) => {
        const index = this.state.list.name.indexOf(name)
        return index
    }
    render() {
        // console.log(this.props.id)
        const { redirect } = this.state;
        const { redirect2 } = this.state
        if (redirect) {
            return <Redirect to='/App' />;
        }
        if(redirect2){
            return <Redirect to='/' />
        }
        const list = this.state.names.map(p =>
            <div key={p}>
                <h3 className="name">{p}</h3>

                <div>
                    <input type="text" onChange={this.timeInput} name={p} className="input question" id="howMany" required autoComplete="off"  placeholder='Ile rund (1-4)?'/>
                    <label><span></span></label>
                </div>

            </div>)

        return (



            <div className="full">
                <video autoPlay loop id="video-background" muted playsInline>
                    <source src="./../../img/Wakeport Kaniów by Mavic Pro.mp4" type="video/mp4" />
                </video>
                <div className="central_box box">

                    {list}
                    <div className="next">
                    </div>
                </div>
                <button type="submit" onClick={this.submitHandelSave} className="startBtn1 next1">SAVE </button>
                <button type="submit" onClick={this.submitHandel} className="startBtn1 next1">START </button>

            </div>

        )
    }

}
