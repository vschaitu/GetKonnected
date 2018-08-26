const io = require('./server.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
		LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, 
		MESSAGE_SENT, TYPING, PRIVATE_MESSAGE, NEW_CHAT_USER  } = require('./Events')

const { createUser, createMessage, createChat } = require('./Factories')

let connectedUsers = { }

let communityChat = createChat({isCommunity:true})

module.exports = function(socket){
	
	
	console.log("User Connected on: " + new Date().toLocaleString() + "socketid " + socket.id);
	let sendMessageToChatFromUser;
	
	let sendTypingFromUser;

	io.on('connect',() => {
		console.log("new user got in?")
	})
	
	//Verify Username
	socket.on(VERIFY_USER, (name, displayName, callback)=>{
		if(isUser(connectedUsers, name)){
			callback({ isUser:true, user:null })
		}else{
			callback({ isUser:false, user:createUser({name:name, displayName:displayName, socketId:socket.id})})
		}
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user)=>{
		console.log("user connected socket " + socket.id )
		user.socketId = socket.id
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user
		sendMessageToChatFromUser = sendMessageToChat(user.displayName)
		sendTypingFromUser = sendTypingToChat(user)

		io.emit(USER_CONNECTED, connectedUsers)

	})
	
	//User disconnects
	socket.on('disconnect', ()=>{
		console.log("user disconnected on: " + new Date().toLocaleString() + "socketid " + socket.id) 
		if("user" in socket){
			console.log("user disconnected socket" + socket.id )
			connectedUsers = removeUser(connectedUsers, socket.user.name)
			io.emit(USER_DISCONNECTED, connectedUsers)
		}
	})

	//User logsout
	socket.on(LOGOUT, ()=>{
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback)=>{
		callback(communityChat)
	})

	socket.on(MESSAGE_SENT, ({chatId, message})=>{
		sendMessageToChatFromUser(chatId, message)
	})

	socket.on(TYPING, ({chatId, isTyping})=>{
		sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, ({reciever, sender, activeChat})=>{
		console.log("sender", sender)
		console.log("reciver", reciever)
		console.log("activechat", activeChat)
		console.log("connectedUsers", connectedUsers)
		if(reciever.name in connectedUsers){
			const recieverSocket = connectedUsers[reciever.name].socketId
			if(activeChat === null || activeChat.id === communityChat.id){
				const newChat = createChat({ name:"", users:[reciever, sender] })
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
				socket.emit(PRIVATE_MESSAGE, newChat)
			}else{
				//Send New User Name to other users to update chat
				let currentUsers = activeChat.users.map( a => a.name)
				if(currentUsers.indexOf(reciever.name) === -1)	{
					console.log("mymap")
					console.log(currentUsers.filter( user => user in connectedUsers ).map(user => connectedUsers[user]))
					currentUsers
					.filter( user => user in connectedUsers )
					.map( user => connectedUsers[user] )
					.map( user => {
						socket.to(user.socketId)
						.emit(NEW_CHAT_USER, { chatId:activeChat.id, newUser: { name : reciever.name, displayName: reciever.displayName} })
					})
					socket.emit(NEW_CHAT_USER, { chatId:activeChat.id, newUser: { name : reciever.name, displayName: reciever.displayName} })	
					activeChat.users.push(reciever)
					socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat)								
				}
			}
		}
	})
}
/*
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user){
	return (chatId, isTyping)=>{
		io.emit(`${TYPING}-${chatId}`, {user, isTyping})
	}
}

/*
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendMessageToChat(sender){
	return (chatId, message)=>{
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
	}
}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user){
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username){
  	return username in userList
}