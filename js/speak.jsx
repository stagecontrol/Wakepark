import React from 'react';

export default class Speak extends React.Component{
    name = this.props.name
    speak =(name)=>{
        let msg = new SpeechSynthesisUtterance(props);
        msg.rate = 1;
        msg.pitch = 1;
        window.speechSynthesis.speak(msg);
    }

  render(){


      return <div>{this.speak()}</div>
  }
   }