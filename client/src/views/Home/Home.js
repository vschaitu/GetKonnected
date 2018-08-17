import React from "react";
import { Redirect } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

import withStyles from '@material-ui/core/styles/withStyles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// core components
import homeStyle from '../../assets/jss/views/homeStyle';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import GridItem from '../../components/Grid/GridItem.jsx';
import Button from '../../components/CustomButtons/Button.jsx';
import Header from "../../components/Header/Header.jsx";

import Eject from "@material-ui/icons/Eject";



class Home extends React.Component {

    // constructor (props) {
    //     super(props)
    // }
    state = {
        redirectTo : null
    }
    signout = () => {
        this.props.objAuth.logout()
        this.setState({ redirectTo: '/login' });
    }

    componentDidMount() {
        this.setState({ redirectTo: null });
    }

    render() {

        console.log(this.props)
    

        let username

        if (this.props.objAuth.user.local !== undefined) {
            username = this.props.objAuth.user.local.username
        } else if (this.props.objAuth.user.google !== undefined) {
            username = this.props.objAuth.user.google.name
        } else if (this.props.objAuth.user.twitter !== undefined) {
            username = this.props.objAuth.user.twitter.displayName
        }

        const { classes } = this.props


        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        }
        return (
            <React.Fragment>
                <CssBaseline />
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem>
                            <Header
                                brand={username}
                                color="info"
                                rightLinks={
                                    <List className={classes.list}>
                                        <ListItem className={classes.listItem}>
                                            <Button color="transparent" className={classes.navLink} onClick={this.signout}>
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

export default withStyles(homeStyle)(Home);


// import React from "react";
// const Home = () => <h3>Protected</h3>;
// export default Home;