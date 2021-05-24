const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)

//Подключение сокета
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

//Обработка определенных запросов
// (отправка сообщений, подключения, окончания звонка,
// ответа на звонок, и звонка)

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on('message', ({ name, message }) => {
		io.emit('message', {
			name,
			message
		})
	})

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	//передаем на клиентскую часть
	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", {
			signal: data.signalData,
			from: data.from,
			name: data.name
		})
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

const PORT = 5000
server.listen(PORT, () => console.log(`server is running on ${PORT} `))