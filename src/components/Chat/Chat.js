import React , {useEffect , useState} from 'react';
import queryString from 'query-string';
import './Chat.css';
import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';

import io from 'socket.io-client';

let socket;

const Chat = ({location}) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message , setMessage] = useState('');
  const [messages , setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const {name , room } = queryString.parse(location.search);
    socket = io(ENDPOINT)
    setName(name);
    setRoom(room);

    socket.emit('join' , { name : name , room : room } , (error)=>{
      if(error){
        alert(error);
      }
    });

  },[ENDPOINT , location.search]);

  useEffect(() => {
    socket.on('message' , (message) => {
      setMessages(messages => [...messages , message]);
    })

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  },[]);

  const sendMessage = (event) => {
    event.preventDefault();
    if(message){
      console.log('sending' , message)
      socket.emit('sendMessage' , message , ()=> setMessage(''))
    }
  }

  return(
    <div className="outerContainer">
      <div className="container">
        <InfoBar/>
        <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
      <TextContainer users={users}/>
    </div>
  )
}

export default Chat;