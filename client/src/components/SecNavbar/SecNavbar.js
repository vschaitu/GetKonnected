import React from "react";
import { Redirect } from 'react-router-dom';

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



class SecNavbar extends React.Component {

    
    state = {
        redirectTo : null
    }

    signout()  {
		this.props.objAuth.logout(() => {
			this.setState({ redirectTo: '/' })
		})
	}

    componentDidMount() {
        this.setState({ redirectTo: null });
    }

    render() {
    
        const {chatUser} = this.props.objAuth

        const { classes } = this.props


        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        }
        return (
            <React.Fragment>
                    <GridContainer>
                        <GridItem>
                            <Header
                                brand={chatUser.displayName}
                                color="info"
                                rightLinks={
                                    <List className={classes.list}>
                                        <ListItem className={classes.listItem}>
                                            <Button color="transparent" className={classes.navLink} onClick={() => this.signout()}>
                                                <Eject className={classes.icons} />
                                            </Button>
                                        </ListItem>
                                    </List>
                                }
                            />
                        </GridItem>
                    </GridContainer>
            </React.Fragment>
        )
    }
}

export default withStyles(homeStyle)(SecNavbar);
