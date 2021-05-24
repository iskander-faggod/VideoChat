import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import {Typography} from "@material-ui/core"

import "./Chat.css"
import Button from "@material-ui/core/Button"
import io from "socket.io-client"

//в верстке пробрасываю пропсы(имя пользователя)
function Chat(props) {
    //обьявление состояний
    const [state, setState] = useState({message: "", name: ""})
    const [chat, setChat] = useState([])
    const {name} = props
    const socketRef = useRef()


    useEffect(
        //коннект к сокету, заполняю массив с сообщениями
        () => {
            socketRef.current = io.connect("http://localhost:5000")
            socketRef.current.on("message", ({name, message}) => {
                setChat([...chat, {name, message}])
            })
            return () => socketRef.current.disconnect()
        },
        [chat]
    )

    //считываю значение сообщений с event.target
    const onTextChange = (e) => {
        setState({...state, [e.target.name]: e.target.value})
    }

    //обработка отправки сообщения
    const onMessageSubmit = (e) => {
        const {name, message} = state
        socketRef.current.emit("message", {name, message})
        e.preventDefault()
        setState({message: "", name})
        console.log(message)
    }

    //вывожу содержимое чата
    const renderChat = () => {
        return chat.map(({name, message}, index) => (
            <div key={index}>
                <h3>
                    {name}: <span>{message}</span>
                </h3>
            </div>
        ))
    }

    //верстка
    return (
        <div className="card">
            <form onSubmit={onMessageSubmit}>
                <h1>Messenger</h1>
                <div className="name-field">
                    <Typography color="primary" variant="h3">{name || ` `}</Typography>
                </div>
                <div>
                    <TextField
                        name="message"
                        onChange={(e) => onTextChange(e)}
                        value={state.message}
                        id="outlined-multiline-static"
                        variant="outlined"
                        label="Message"
                    />
                </div>
                <Button type='submit' style={{width: "250px", marginTop :'30px'}} variant="contained" color="secondary">Send Message</Button>
            </form>
            <div className="render-chat">
                <h1>Messages</h1>
                {renderChat()}
            </div>
        </div>
    )
}

export default Chat
