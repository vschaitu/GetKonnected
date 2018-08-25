import React from "react";
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from '@material-ui/core/FormControl';
import Card from '../Card/Card.jsx';
import CardBody from '../Card/CardBody.jsx';
// @material-ui/icons
import List from "@material-ui/icons/List";
import Face from "@material-ui/icons/Face";
import Search from "@material-ui/icons/Search"
// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import NavPills from "../NavPills/NavPills.jsx";
import pillsStyle from "../../assets/jss/components/pillsStyle.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
import { SecSidebarOption } from './SecSidebarOption'
import { last, get, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'


class SecSidebar extends React.Component {

  static propTypes = {
    onSendPrivateMessage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setActiveChat: PropTypes.func.isRequired,
    chats: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeChat: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  static type = {
    USERS: "users",
    CHATS: "chats",
  }

  constructor(props) {
    super(props)
    this.state = {
      reciever: "",
      activeSideBar: SecSidebar.type.CHATS,
      redirectTo: null,
      activeTab: 0,
      users: null
    }
  }

  //   componentDidUpdate(prevProps, prevState) {
  //     console.log("prev props", prevProps.users)
  //     console.log("prev state", prevState.users)
  // }


  componentWillReceiveProps(nextProps) {
    if (nextProps.users !== this.props.users) {
      this.setState({ users: nextProps.users })
    }
  }

  handleChange = name => ({ target: { value } }) => {
    let updatedList = this.state.users
    if (value === "") {
      updatedList = this.props.users
    } else {
      updatedList = updatedList.filter(function (item) {
        return item.name.toLowerCase().search(value.toLowerCase()) !== -1;
      });
    }
    this.setState({
      [name]: value ,
      users: updatedList,
      activeTab : 1
    })
  }

  handleChangeTab = (event, value) => {
    this.setState({ activeTab: value });
  };

  handleSubmit = (e) => {
    e.preventDefault()
    const { reciever } = this.state
    const { onSendPrivateMessage } = this.props

    onSendPrivateMessage(reciever)
    this.setState({ reciever: "" })
  }

  setActiveSideBar = (activeSideBar) => {
    if (activeSideBar !== this.state.activeSideBar)
      this.setState({ activeSideBar })
  }

  addChatForUser(reciever) {
    this.props.onSendPrivateMessage(reciever)
    this.setActiveSideBar(SecSidebar.type.CHATS)
  }



  render() {

    const { classes } = this.props;
    const { user, setActiveChat, chats, activeChat } = this.props
    const { reciever, activeSideBar, users } = this.state

    
    
    return (
      <Card style={{ height: "98%", marginBottom: "0pX", marginTop: "0pX", overflowY: "auto" }}>
        <CardBody>
          <div className={classes.section}>
            <div className={classes.container}>
              <div id="navigation-pills">
                <FormControl fullWidth>
                  <CustomInput
                    labelText="Search for people"
                    id="reciever"
                    label="reciever"
                    value={reciever}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (<InputAdornment position="end"><Search /></InputAdornment>),
                      type: "text",
                      onChange: this.handleChange('reciever')
                    }}
                  />
                </FormControl>
                <GridContainer >
                  <GridItem>
                    <NavPills
                      color="info"
                      active={this.state.activeTab}
                      onChange={this.handleChangeTab}
                      tabs={[
                        {
                          tabButton: "Chats",
                          tabIcon: List,
                          tabContent: (
                            chats.map((chat) => {
                              return (
                                <SecSidebarOption
                                  key={chat.id}
                                  lastMessage={get(last(chat.messages), 'message', '')}
                                  name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)}
                                  active={activeChat.id === chat.id}
                                  onClick={() => { setActiveChat(chat) }}
                                />
                              )
                            })
                          )
                        },
                        {
                          tabButton: "Users",
                          tabIcon: Face,
                          tabContent: (
                            differenceBy(users, [user], 'id').map((otherUser) => {
                              return (
                                <SecSidebarOption
                                  key={otherUser.id}
                                  name={otherUser.displayName}
                                  onClick={() => { this.addChatForUser({name:otherUser.name, displayName: otherUser.displayName}) }}
                                />
                              )
                            })
                          )
                        },
                      ]}
                    />
                  </GridItem>
                </GridContainer>

              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default withStyles(pillsStyle)(SecSidebar);
