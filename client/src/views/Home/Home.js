import React from "react";

import CssBaseline from '@material-ui/core/CssBaseline';

import withStyles from '@material-ui/core/styles/withStyles';



// core components
import homeStyle from '../../assets/jss/views/homeStyle';

import SecNavbar from "../../components/SecNavbar/SecNavbar";

import GridContainer from '../../components/Grid/GridContainer.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import SecSidebar from "../../components/SecSidebar/SecSidebar";
import Messages from "../../components/MessageBox/Messages"
import MessageInput from '../../components/MessageBox/MessageInput'

import {
	COMMUNITY_CHAT,
	MESSAGE_SENT,
	MESSAGE_RECIEVED,
	TYPING,
	PRIVATE_MESSAGE,
	USER_CONNECTED,
	NEW_CHAT_USER,
	VERIFY_USER,
	USER_DISCONNECTED
} from '../../Events';

import { createChatNameFromUsers } from '../../Factories'

import { values, differenceBy, difference } from 'lodash';


class Home extends React.Component {


	state = {
		chats: [],
		users: [],
		activeChat: null
	}

	componentDidMount() {
		const { socket } = this.props.objAuth
		this.initSocket(socket)
	}

	componentWillUnmount() {
		const { socket } = this.props.objAuth
		socket.off(PRIVATE_MESSAGE)
		socket.off(USER_DISCONNECTED)
		socket.off(USER_CONNECTED)
		socket.off(NEW_CHAT_USER)
	}

	initSocket(socket) {
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		socket.on(PRIVATE_MESSAGE, this.addChat)
		// socket.on('connect', () => {
		// 	socket.emit(COMMUNITY_CHAT, this.resetChat)
		// })

		socket.on('connect', () => {
			console.log(" im connected now???")
		})

		socket.on(USER_CONNECTED, (users) => {
			this.setState({ users: values(users) })
		})
		socket.on(USER_DISCONNECTED, (users) => {
			const removedUsers = differenceBy(this.state.users, values(users), 'name')
			this.removeUsersFromChat(removedUsers.map(a => a.name))
			this.setState({ users: values(users) })
		})
		socket.on(NEW_CHAT_USER, this.addUserToChat)
		socket.on('reconnect', () => {
			console.log("this is reconnect", socket)
			this.reInitialize(socket)
		})
	}


	reInitialize = (socket)=>{
		console.log("props", this.props)
		const { chatUser: user } = this.props.objAuth

		if(user){
			socket.emit(VERIFY_USER, user.name, user.displayName, ({isUser, user})=>{ 
				if(isUser)
					console.log("why im still here")
				else 
				 	socket.emit(USER_CONNECTED, user)
			})				
		}
	}

	addUserToChat = ({ chatId, newUser }) => {
		const { chats } = this.state
		const newChats = chats.map(chat => {
			if (chat.id === chatId)
				return Object.assign({}, chat, { users: [...chat.users, newUser] })
			return chat
		})
		this.setState({ chats: newChats })
	}

	removeUsersFromChat = (removedUsers) => {

		const { chats } = this.state
		const newChats = chats.map(chat => {
			let newUsers = chat.users.filter ( i => removedUsers.indexOf(i.name) === -1)
			// let newUsers = difference(chat.users.name, removedUsers.map(u => u.name))
			return Object.assign({}, chat, { users: newUsers })
		})
		this.setState({ chats: newChats })
	}

	sendOpenPrivateMessage = (reciever) => {
		const { socket } = this.props.objAuth
		const { chatUser: user } = this.props.objAuth
		const { activeChat } = this.state
		socket.emit(PRIVATE_MESSAGE, { reciever, sender: {name: user.name, displayName: user.displayName}, activeChat })
	}

	/*
	*	Reset the chat back to only the chat passed in.
	* 	@param chat {Chat}
    */

	resetChat = (chat) => {

		return this.addChat(chat, true)
	}

	/*
	*	Adds chat to the chat container, if reset is true removes all chats
	*	and sets that chat to the main chat.
	*	Sets the message and typing socket events for the chat.
	*	
	*	@param chat {Chat} the chat to be added.
	*	@param reset {boolean} if true will set the chat as the only chat.
    */

	addChat = (chat, reset = false) => {
		const { socket } = this.props.objAuth
		const { chats } = this.state
	
		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat })

		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`

		const typingEvent = `${TYPING}-${chat.id}`

		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}

	/*
	* 	Returns a function that will 
	*	adds message to chat with the chatId passed in. 
	*
	* 	@param chatId {number}
    */

	addMessageToChat = (chatId) => {
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat) => {
				if (chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({ chats: newChats })
		}
	}

	/*
	*	Updates the typing of chat with id passed in.
	*	@param chatId {number}
    */
	updateTypingInChat = (chatId) => {
		return ({ isTyping, user }) => {
			if (this.props.objAuth.chatUser) {
				if (user.name !== this.props.objAuth.chatUser.name) {

					const { chats } = this.state

					let newChats = chats.map((chat) => {
						if (chat.id === chatId) {
							if (isTyping && !chat.typingUsers.includes(user.displayName)) {
								chat.typingUsers.push(user.displayName)
							} else if (!isTyping && chat.typingUsers.includes(user.displayName)) {
								chat.typingUsers = chat.typingUsers.filter(u => u !== user.displayName)
							}
						}
						return chat
					})
					this.setState({ chats: newChats })
				}
			}
		}
	}

	/*
	*	Adds a message to the specified chat
	*	@param chatId {number}  The id of the chat to be added to.
	*	@param message {string} The message to be added to the chat.
    */

	sendMessage = (chatId, message) => {
		const { socket } = this.props.objAuth
		socket.emit(MESSAGE_SENT, { chatId, message })
	}

	/*
	*	Sends typing status to server.
	*	chatId {number} the id of the chat being typed in.
	*	typing {boolean} If the user is typing still or not.
	*/
	sendTyping = (chatId, isTyping) => {
		const { socket } = this.props.objAuth
		socket.emit(TYPING, { chatId, isTyping })
	}

	setActiveChat = (activeChat) => {
		if (activeChat !== this.state.activeChat)
			this.setState({ activeChat })
	}

	render() {
		const { classes } = this.props
		const { objAuth } = this.props
		const { chatUser: user } = this.props.objAuth
		const { chats, activeChat, users } = this.state
		console.log("state", this.state)
		console.log("props", this.props)
		return (
			<React.Fragment>

				<CssBaseline />
				<div className={classes.container} >
					<SecNavbar
						objAuth={objAuth}
					/>
				</div>
				<div className={classes.gridplace} >

					<GridContainer style={{height:"100%"}}>

						<GridItem xs={12} sm={6} md={4}>
							<SecSidebar
								objAuth={objAuth}
								chats={chats}
								user={user}
								users={users}
								activeChat={activeChat}
								setActiveChat={this.setActiveChat}
								onSendPrivateMessage={this.sendOpenPrivateMessage}
							/>
						</GridItem>

						<GridItem xs={12} sm={6} md={8}>
							{
								activeChat !== null ? (
									<div style={{height:"97%"}}>
										<Messages
											messages={activeChat.messages}
											user={user}
											typingUsers={activeChat.typingUsers}
											name={activeChat.isCommunity ? activeChat.name : createChatNameFromUsers(activeChat.users, objAuth.chatUser.displayName)}
										/>
										<MessageInput
											sendMessage={
												(message) => {
													this.sendMessage(activeChat.id, message)
												}
											}
											sendTyping={
												(isTyping) => {
													this.sendTyping(activeChat.id, isTyping)
												}
											}
										/>
									</div>
								) : (
										<div className="chat-room choose">
											<h3>Choose a chat!</h3>
										</div>
									)
							}
						</GridItem>

					</GridContainer>
				</div>

			</React.Fragment>
		)
	}
}

export default withStyles(homeStyle)(Home);


// import React from "react";
// const Home = () => <h3>Protected</h3>;
// export default Home;