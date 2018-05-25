import React from 'react';



export default class Animation extends React.Component{
    myMove=()=>{
        let elem = document.getElementById("myAnimation");   
        let time = 0;
        let id = setInterval(frame, 10);

        frame=()=> {
          if (time == 350) {
            clearInterval(id);
          } else {
            pos++; 
            elem.style.top = pos + 'px'; 
            elem.style.left = pos + 'px'; 
          }
        }
      }
}

