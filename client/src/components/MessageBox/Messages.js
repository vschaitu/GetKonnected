import React, { Component } from 'react';
import Card from '../Card/Card.jsx';
import CardHeader from '../Card/CardHeader.jsx';
import CardBody from '../Card/CardBody.jsx';
import CardFooter from '../Card/CardFooter.jsx';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import withStyles from "@material-ui/core/styles/withStyles"
import { List } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import messageStyle from '../../assets/jss/components/messageComponent';

class Messages extends Component {

    scrollDown() {
        const { container } = this.refs
        console.log(container)
        container.scrollTop = container.scrollHeight
        
    }

    componentDidMount() {
        this.scrollDown()
    }

    componentDidUpdate(prevProps, prevState) {
        this.scrollDown()
    }

    render() {

        const { classes } = this.props;
        const { name, messages, user, typingUsers } = this.props

        return (
            <React.Fragment>
                <Card  style={{ height: "79%", marginBottom: "0px" }} className={classes.textCenter}>
                    <CardHeader color="info" className={classes.cardHeader}>
                        <Typography variant="subheading" color="inherit">
                            {name}
                        </Typography>
                    </CardHeader>
                    <div style={{ height: "100%", overflowY: "auto" }} ref='container'>
                    <CardBody >
                        <List>
                            {
                                messages.map((mes) => {
                                    return (mes.sender === user.displayName) ?
                                         (
                                            <ListItem
                                                key={mes.id}
                                                className={classes.messageWrap}
                                            >
                                                <ListItemText
                                                    primary={mes.message}
                                                    secondary={mes.sender + " " + mes.time}
                                                    className={classes.messageWrap}
                                                />
                                                <Avatar >
                                                    {mes.initials}
                                                </Avatar>
                                            </ListItem>
                                        )
                                    : 
                                         (
                                            <ListItem
                                                key={mes.id}
                                            >
                                                <Avatar >
                                                    {mes.initials}
                                                </Avatar>
                                                <ListItemText
                                                    primary={mes.message}
                                                    secondary={mes.sender + " " + mes.time}
                                                />
                                            </ListItem>
                                        )
                                })
                            }
                        </List>
                    </CardBody>
                    </div>
                    <CardFooter className={classes.textMuted}>
                        {
                            typingUsers.map((name) => {
                                return (
                                    <div key={name}>
                                        {`${name} is typing . . .`}
                                    </div>
                                )
                            })
                        }
                    </CardFooter>
                </Card>
            </React.Fragment>
        );
    }
}

export default withStyles(messageStyle)(Messages);