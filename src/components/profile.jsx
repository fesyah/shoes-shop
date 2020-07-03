import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
    IconButton, 
    Avatar,
    Menu,
    MenuItem
} from '@material-ui/core'

import { LogOut } from '../actions'

class Profile extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            anchorEl : null
        }
    }

    handleClick = (event) => {
        this.setState({anchorEl : event.currentTarget})
    }

    handleClose = () => {
        this.setState({anchorEl : null})
    }

    handleLogOut = () => {
        localStorage.clear()
        this.props.LogOut()
    }

    render () {
        return (
            <div>
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => this.handleClick(e)}>
                    {
                        this.props.username ?
                        <Avatar style={{backgroundColor : '#130f40'}}>{this.props.username.charAt(0).toUpperCase()}</Avatar> :
                        <Avatar>U</Avatar>
                    }
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    getContentAnchorEl={null}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {
                        this.props.role ? this.props.role === 'admin' ?
                        <div>
                            <Link to='/dashboard' style={styles.link}>
                                <MenuItem>Dashboard</MenuItem>
                            </Link>
                            <Link to='/' style={styles.link}>
                                <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                            </Link>
                        </div>
                        :
                        <div>
                            <MenuItem>Profile</MenuItem>
                            <Link to='/cart' style={styles.link}>
                                <MenuItem>Cart</MenuItem>
                            </Link>
                            <MenuItem>History</MenuItem>
                            <Link to='/' style={styles.link}>
                                <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                            </Link>
                        </div>
                        :
                        <div>
                            <Link to='/login' style={styles.link}>
                                <MenuItem>Login</MenuItem>
                            </Link>
                            <Link to='/register' style={styles.link}>
                                <MenuItem>Register</MenuItem>
                            </Link>
                        </div>
                    }
                </Menu>
            </div>
        )
    }
}

const styles = {
    link : {
        textDecoration : 'none',
        color : 'black'
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username,
        role : state.user.role
    }
}

export default connect(mapStateToProps, { LogOut })(Profile)