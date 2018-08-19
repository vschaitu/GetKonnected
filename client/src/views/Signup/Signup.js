import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import InputAdornment from "@material-ui/core/InputAdornment";
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import loginStyle from '../../assets/jss/views/loginStyle';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import Button from '../../components/CustomButtons/Button.jsx';
import Card from '../../components/Card/Card.jsx';
import CardHeader from '../../components/Card/CardHeader.jsx';
import CardBody from '../../components/Card/CardBody.jsx';
import CardFooter from '../../components/Card/CardFooter.jsx';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutlined";
import People from "@material-ui/icons/People";

import image from '../../assets/img/signup.jpg';

class Signup extends Component {
    state = {
        cardAnimaton: 'cardHidden',
        user: {
            email: '',
            username: '',
            password: ''
        },
        redirectTo: null
    }

    handleChange = name => ({ target: { value } }) => {
        const user = { ...this.state.user }
        user[name] = value
        this.setState({ user })
    }

    handleSubmit() {

        const { user } = this.state
        console.log("sending post ot create user")
        //request to server to add a new username/password
        axios
            .post('/api/user/local', { user })
            .then(response => {
                console.log(response)
                if (!response.data.errors && !response.data.error) {
                    console.log('successful signup')
                    this.setState({ //redirect to login page
                        redirectTo: '/login'
                    })
                } else if (response.data.error) {
                    console.log('username already taken')
                }
                else {
                    console.log('Invalid entry')
                }
            }).catch(error => {
                console.log('signup error: ')
                console.log(error)

            })
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }

    render() {
        const { classes } = this.props
        const { username, email, password } = this.state.user
        console.log(() => this.state.email.length > 5)
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <React.Fragment>
                    <CssBaseline />
                    <div
                        className={classes.pageHeader}
                        style={{
                            backgroundImage: "url(" + image + ")",
                            backgroundSize: "cover",
                            backgroundPosition: "top center"
                        }}>
                        <div className={classes.container}>
                            <GridContainer justify="center">
                                <GridItem xs={12} sm={8} md={4} xl={3}>
                                    <Card className={classes[this.state.cardAnimaton]}>
                                        <CardHeader color="primary" className={classes.cardHeader}>
                                            <br></br>
                                            <Typography variant="title" color="inherit">
                                                Get Konnected
                                            </Typography>
                                            <br />
                                        </CardHeader>
                                        <form className={classes.form}>
                                            <CardBody>
                                                <CustomInput
                                                    labelText="Display Name..."
                                                    id="username"
                                                    label="username"
                                                    value={username}

                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        type: "text",
                                                        onChange: this.handleChange('username'),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <People className={classes.inputIconsColor} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                <CustomInput
                                                    labelText="Email..."
                                                    id="email"
                                                    label="Email"
                                                    value={email}
                                                    onChange={this.handleChange('email')}
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        type: "email",
                                                        onChange: this.handleChange('email'),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Email className={classes.inputIconsColor} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                <CustomInput
                                                    labelText="Password"
                                                    id="password"
                                                    label="Password"
                                                    value={password}
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        type: "password",
                                                        onChange: this.handleChange('password'),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <LockOutline
                                                                    className={classes.inputIconsColor}
                                                                />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </CardBody>
                                            <CardFooter className={classes.cardFooter}>
                                                <Button
                                                    round
                                                    color="primary"
                                                    disabled={!(Boolean(username.length > 2 && password.length > 2 && email.length > 2))}
                                                    size="lg"
                                                    onClick={() => this.handleSubmit()}
                                                >
                                                    SIGN UP
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </Card>
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default withStyles(loginStyle)(Signup);