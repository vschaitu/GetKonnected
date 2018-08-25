import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export class SecSidebarOption extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    lastMessage: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func
  }
  static defaultProps = {
    lastMessage: "",
    active: false,
    onClick: () => { }
  }
  shouldComponentUpdate(nextProps) {
    return (this.props.lastMessage !== nextProps.lastMessage
      || this.props.name !== nextProps.name
      || this.props.active !== nextProps.active)
  }
  render() {
    const { active, lastMessage, name, onClick } = this.props


    return (
      <ListItem button divider onClick={(e) => { onClick(e) }}>

        <ListItemText
          primary={name}
          secondary={lastMessage}
          primaryTypographyProps={active
            ? {
              variant: "subheading",
              noWrap : true,
              style: {
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#00acc1"
              }
            }
            : {
              variant: "caption",
              noWrap : true
            }
          }
        />
      </ListItem>
    )
  }
}