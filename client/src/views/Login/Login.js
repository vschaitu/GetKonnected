import React from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import CssBaseline from '@material-ui/core/CssBaseline';

import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';

// core components
import loginStyle from '../../assets/jss/views/loginStyle';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import Button from '../../components/CustomButtons/Button.jsx';
import Card from '../../components/Card/Card.jsx';
import CardBody from '../../components/Card/CardBody.jsx';
import CardHeader from '../../components/Card/CardHeader.jsx';
import CardFooter from '../../components/Card/CardFooter.jsx';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import SnackbarContent from "../../components/Snackbar/SnackbarContent.jsx";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutlined";
import InfoOutline from "@material-ui/icons/InfoOutlined";

import image from '../../assets/img/login.jpeg'

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

class Login extends React.Component {
    state = {
        cardAnimaton: "cardHidden",
        email: '',
        password: '',
        redirectTo: null
    };

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }

    handleChange = name => ({ target: { value } }) =>
        this.setState({
            [name]: value
        })

    handleSubmit() {

        console.log('handleSubmit')
        const { email, password } = this.state

        this.setState({ isAuthenticated: null })

        axios
            .post('/user/login', {
                'email': email,
                'password': password
            })
            .then(response => {
                console.log('login response: ')
                console.log(response)
                if (response.status === 200) {
                    // update App.js state
                    // this.props.updateUser({
                    //     loggedIn: true,
                    //     username: response.data.username
                    // })
                    // update the state to redirect to home
                    // this.setState({
                    //     redirectTo: '/'
                    // })
                    this.setState({ isAuthenticated: true })
                    setTimeout(
                        function () {
                            this.setState({ redirectTo: '/' });
                        }.bind(this),
                        1000
                    );
                }
            })
            .catch(error => {
                console.log('login error: ')
                console.log(error.response);
                this.setState({ isAuthenticated: false })
            })
    }

    render() {
        const { classes } = this.props
        const { email, password } = this.state
        console.log(this.props)
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
                                        <form className={classes.form}>
                                            <CardHeader color="primary" className={classes.cardHeader}>
                                                <Typography variant="subheading" color="inherit">
                                                    Login
                                                </Typography>
                                                <div className={classes.socialLine}>
                                                    <Button
                                                        justIcon
                                                        href="#pablo"
                                                        target="_blank"
                                                        color="transparent"
                                                        onClick={e => e.preventDefault()}
                                                    >
                                                        <i className={"fab fa-twitter"} />
                                                    </Button>
                                                    <Button
                                                        justIcon
                                                        href="#pablo"
                                                        target="_blank"
                                                        color="transparent"
                                                        onClick={e => e.preventDefault()}
                                                    >
                                                        <i className={"fab fa-facebook"} />
                                                    </Button>
                                                    <Button
                                                        justIcon
                                                        href="#pablo"
                                                        target="_blank"
                                                        color="transparent"
                                                        onClick={e => e.preventDefault()}
                                                    >
                                                        <i className={"fab fa-google-plus-g"} />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <p className={classes.divider}>Or Be Classical</p>
                                            <CardBody>
                                                <CustomInput
                                                    labelText="Email..."
                                                    id="email"
                                                    label="Email"
                                                    value={email}
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
                                                    id="pass"
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
                                                    size="md"
                                                    onClick={() => this.handleSubmit()}
                                                >
                                                    Get started
                                                </Button>
                                                 OR 
                                                <Button
                                                    round
                                                    color="info"
                                                    size="md"
                                                    href="/signup"
                                                >
                                                    Register
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </Card>
                                </GridItem>
                            </GridContainer>
                        </div>
                        <div className={classes.container}>
                            {this.state.isAuthenticated === true &&
                                <SnackbarContent
                                    message={
                                        <span>
                                            Suceess, you will be redirected in a moment...
                                        </span>
                                    }
                                    close
                                    color="success"
                                    icon={InfoOutline}
                                    vertical="bottom"
                                    TransitionComponent={TransitionUp}
                                />
                            }
                            {this.state.isAuthenticated === false &&
                                <SnackbarContent
                                    message={
                                        <span>
                                            <b>Waring:</b> Invalid credentials...
                                        </span>
                                    }
                                    close
                                    color="danger"
                                    TransitionComponent={TransitionUp}
                                    icon={InfoOutline}
                                    vertical="bottom"
                                />
                            }
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default withStyles(loginStyle)(Login);
