import React, {useEffect,useState} from "react";
import io from "socket.io-client";
import { AppBar, Toolbar, Typography, Container,IconButton,TextField } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import img from "./assets/images/shoe4.jpg"
import './App.css';


const socket = io.connect("http://localhost:2000");

function App() {

  const [currentMessaage,setCurrentMessage]  = useState('');
  const [userName,setUserName] = useState('')
  const [messageList,setMessageList]  = useState([]);
  const [viewInput,setViewInput] = useState(false)

  const handleclick = () => {
    setViewInput(true)
  }
  
    const inputStyle = {
      color: '#fff',
    };

    const room = '12345';

    const joinRoom = () => { 
      socket.emit("join_room",room)
    }

    const sendMessage = async() => {
      if(currentMessaage !== "") {
        const messageData ={
          room:room,
          author:userName,
          message:currentMessaage,
          time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        };

        await socket.emit("send_message",messageData);
        setMessageList((list) => [...list, messageData]);
      }
    }
 

    useEffect(() => {
      joinRoom();
      socket.on("recieve_message", (data) => {
        setMessageList((list) => [...list, data]);
      });
 
      return () => { 
        socket.off("recieve_message");
      };
    }, []);
    
  
  
  return (
    <div className="App">
    <AppBar position="sticky" style={{  background: '#0a0408' }}>
  <Container>
    <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={img} alt="Logo" style={{ width: "40px", height: "40px", borderRadius: '50%', marginLeft: '-5%' }} />
        <Typography variant="h6" style={{ marginLeft: '10px' }}>Rahul Radhakrishnan</Typography>
        <CircleIcon  style={{ color: 'green', fontSize: 12,marginLeft: '08px' }}/>
      </div>
      <div style={{width:'7%' ,display: 'flex', alignItems: 'center',justifyContent:'space-between'}}>
        <AttachFileIcon />
        <PersonIcon />
      </div>
    </Toolbar>
  </Container>
</AppBar>
<div>
  {!viewInput ?
  (<div> <input
            type="text"
            placeholder="enter your name..."
            onChange={(event) => {
              setUserName(event.target.value);
            }}
            
          />
          <button onClick={handleclick}>send</button>
          </div>
): 
null
  }
  <div className="message_body">
{messageList.map((messages) => {
  return (
  <div
                className="message"
                id={userName ===  messages.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messages.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messages.time}</p>
                  </div>
                </div>
              </div>
  )

  })}
</div>
</div>
<div style={{backgroundColor:'#444254',position:'fixed',bottom:'0px', width: '100%',paddingBottom:'10px'}}>
<div style={{ display: 'flex', alignItems: 'center', background: '#0a0408', borderRadius: '50px', padding: '10px', }}>
      <IconButton color="primary">
        <SentimentSatisfiedAltIcon />
      </IconButton>
      <TextField
        variant="standard"
        placeholder="Type a message..."
        onChange={(e) =>{setCurrentMessage(e.target.value)}}
        inputProps={{ style: inputStyle }}
        fullWidth
      />
      <IconButton color="primary" onClick={sendMessage}>
        <SendIcon  />
      </IconButton>
    </div>
    </div>
    </div>
  );
}

export default App;
