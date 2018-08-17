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

// function TransitionUp(props) {
//     return <Slide {...props} direction="up" />;
// }

class Login extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            cardAnimaton: "cardHidden",
            email: '',
            password: '',
            authValid: null,
            errorMessage: null,
            redirectToReferrer: false
        };

    }

    componentDidMount() {
        this.validateUser()
    }

    validateUser() {

        const {objAuth} = this.props

        objAuth.login((isAuthenticated, isUserAlreadyinChat, chatUser, res) => {
            
            if (!isUserAlreadyinChat) {
                if (res.user) {
                    console.log("Yay user", res.user)
                    this.setState({ redirectToReferrer: true })

                } else {
                    console.log("no-user")
                    setTimeout(
                        function () {
                            this.setState({ cardAnimaton: "" });
                        }.bind(this),
                        400
                    );
                }
            } else {
                console.log("user already have got session")
                this.setState({
                    authValid: false,
                    errorMessage: "User already have active session! Can't login!"
                })
            }
        })
    }

    handleChange = name => ({ target: { value } }) =>
        this.setState({
            [name]: value
        })

    handleSubmit() {

        const { email, password } = this.state

        this.setState({ authValid: null })
        console.log("logging in")
        axios
            .post('/user/local/login', {
                'email': email,
                'password': password
            })
            .then(response => {
                console.log('login response: ')
                console.log(response)
                if (response.status === 200) {
                    console.log("calling autheticate again after post")
                    this.validateUser()
                }
            })
            .catch(error => {
                console.log('login error: ')
                console.log(error.response);
                this.setState({ authValid: false })
            })
    }

    // handleGooglelogin() {

    //     console.log("leaveing to google site....")

    //     axios
    //         .post('/user/google/login', {})
    //         .then(response => {
    //             console.log('Will i ever comeback?')
    //         })
    //         .catch(error => {
    //             console.log('something wrong with google login error ')
    //             console.log(error);
    //         })
    // }

    render() {

        const { classes } = this.props
        const { email, password, redirectToReferrer } = this.state
        const { from } = this.props.location.state || { from: { pathname: "/" } };

        if (this.state.redirectToReferrer) {
            return <Redirect to={from} />
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
                                                        href="/user/twitter/login"
                                                        color="transparent"
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
                                                        color="transparent"
                                                        href="http://localhost:8080/user/google/login"
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
                                                    size="sm"
                                                    disabled={!(Boolean(email.length > 2 && password.length > 2))}
                                                    onClick={() => this.handleSubmit()}
                                                >
                                                    Get started
                                                </Button>
                                                OR
                                                <Button
                                                    round
                                                    color="info"
                                                    size="sm"
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
                            {this.state.authValid === true &&
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
                                // TransitionComponent={TransitionUp}
                                />
                            }
                            {this.state.authValid === false &&
                                <SnackbarContent
                                    message={
                                        <span>
                                            <b>Waring:</b> {this.state.errorMessage}
                                        </span>
                                    }
                                    close
                                    color="danger"
                                    // TransitionComponent={TransitionUp}
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
