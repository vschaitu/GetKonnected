import React from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import CssBaseline from '@material-ui/core/CssBaseline';

import withStyles from '@material-ui/core/styles/withStyles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// core components
import appAuthStyle from '../../assets/jss/components/appAuthStyle';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import Button from '../../components/CustomButtons/Button.jsx';
import Header from "../../components/Header/Header.jsx";

import Eject from "@material-ui/icons/Eject";

class AppAuth extends React.Component {

    state = {
        redirectTo: null,
        loggedIn: false,
        user: null
    };

    componentWillMount() {
        this.getUser()
    }

    getUser() {
        axios.get('/user/').then(response => {
            console.log('Get user response: ')
            console.log(response.data)
            if (response.data.user) {
                console.log('Get User: There is a user saved in the server session: ')
                this.setState({
                    loggedIn: true,
                    user: response.data.user
                })
            } else {
                console.log('Get user: no user');
                this.setState({
                    loggedIn: false,
                    user: null ,
                    redirectTo: '/login'
                })
            }
        })
    }

    logout() {
        console.log('logging out')
        axios.post('/user/logout')
        .then(response => {
          console.log(response.data)
          if (response.status === 200) {
            this.setState({
              loggedIn: false,
              username: null,
              redirectTo: '/login'
            })
          }
        })
        .catch(error => {
            console.log('Logout error')
            console.log(error)
        })
    }

    formatUserName () {
        return this.state.user ? this.state.user.email.toUpperCase() : "Who am I?"
    }
    render() {

        const { classes } = this.props

        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <React.Fragment>
                    <CssBaseline />
                    <div className={classes.container}>
                        <GridContainer>
                            <GridItem>
                                <Header
                                    brand={this.formatUserName()}
                                    color="info"
                                    rightLinks={
                                        <List className={classes.list}>
                                            <ListItem className={classes.listItem}>
                                                <Button color="transparent" className={classes.navLink} onClick={() => this.logout()}>
                                                    <Eject className={classes.icons} />
                                                </Button>
                                            </ListItem>
                                        </List>
                                    }
                                />
                            </GridItem>
                        </GridContainer>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default withStyles(appAuthStyle)(AppAuth);
