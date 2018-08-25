import React, { Component } from 'react';
import Card from '../Card/Card.jsx';
import CardBody from '../Card/CardBody.jsx';
import Button from '../CustomButtons/Button';
import Send from '@material-ui/icons/Send';
import FormControl from '@material-ui/core/FormControl';
import CustomInput from "../CustomInput/CustomInput";
import messageStyle from '../../assets/jss/components/messageComponent';
import withStyles from "@material-ui/core/styles/withStyles"

class MessageInput extends Component {

    state = {
        message: null,
        isTyping: false
    };


    handleChange = name => ({ target: { value } }) =>
        this.setState({
            [name]: value
        })

    handleSubmit = (e) => {
        e.preventDefault()
        this.sendMessage()
        this.setState({ message: "" })
        this.refs.sendform.reset()
    }

    sendMessage = () => {
        this.props.sendMessage(this.state.message)

    }

    componentWillUnmount() {
        this.stopCheckingTyping()
    }

    checkTyping = (e) =>  e.keyCode !== 13 && this.sendTyping()

    sendTyping = () => {
        this.lastUpdateTime = Date.now()
        if (!this.state.isTyping) {
            this.setState({ isTyping: true })
            this.props.sendTyping(true)
            this.startCheckingTyping()
        }
    }

	/*
	*	startCheckingTyping
	*	Start an interval that checks if the user is typing.
	*/
    startCheckingTyping = () => {
        this.typingInterval = setInterval(() => {
            if ((Date.now() - this.lastUpdateTime) > 300) {
                this.setState({ isTyping: false })
                this.stopCheckingTyping()
            }
        }, 300)
    }

	/*
	*	stopCheckingTyping
	*	Start the interval from checking if the user is typing.
	*/
    stopCheckingTyping = () => {
        if (this.typingInterval) {
            clearInterval(this.typingInterval)
            this.props.sendTyping(false)
        }
    }


    render() {
        const { message } = this.state
        const { classes } = this.props;

        return (
            <form onSubmit={this.handleSubmit} autoComplete="off" ref="sendform">
                <Card>
                    <CardBody>
                        <FormControl fullWidth required>
                            <div className={classes.flexBox}>
                                <CustomInput
                                    labelText="type something interesting"
                                    id="message"
                                    label="message"
                                    value={message || ""}
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text",
                                        onChange: this.handleChange('message'),
                                        onKeyUp: this.checkTyping
                                    }}
                                >
                                </CustomInput>
                                <Button
                                    color="info"
                                    round
                                    type="submit"
                                > 
                                <Send />
                                </Button>
                            </div>
                        </FormControl>
                    </CardBody>
                </Card>
            </form>
        );
    }
}


export default withStyles(messageStyle)(MessageInput);