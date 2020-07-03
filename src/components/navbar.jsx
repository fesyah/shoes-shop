import React from 'react'
import { Link } from 'react-router-dom'
import {
    AppBar,
    Toolbar
} from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

import { LOGO } from '../assets'
import Profile from './profile'


class Navbar extends React.Component {
    render () {
        return (
            <AppBar position="fixed" style={styles.root} elevation={3}>
                <Toolbar style={styles.toolbar}>
                    <div style={styles.leftContent}>
                        <img src={LOGO} alt="logo" height="100%"/>
                        <Link to='/' style={styles.link}>
                            <h1 style={styles.home}>Home</h1>
                        </Link>
                    </div>
                    <div style={styles.rightContent}>
                        <div style={styles.cart}>
                            <ShoppingCartIcon/>
                            <h6 style={styles.cartTotal}>Rp. 0</h6>
                        </div>
                        <Profile/>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

const styles = {
    root : {
        height : 90,
        padding : '2% 7%',
        display : 'flex',
        justifyContent : 'center',
        backgroundColor : 'rgba(30, 39, 46, 0.3)'
    },
    toolbar : {
        display : 'flex',
        justifyContent : 'space-between',
        padding : 0
    },
    leftContent : {
        height : '100%',
        flexBasis : '50%',
        maxWidth : '50%',
        display : 'flex',
        justifyContent : 'flex-start',
        alignItems : 'center'
    },
    home : {
        fontSize : 20,
        cursor : 'pointer',
        color : 'white'
    },
    rightContent : {
        height : '100%',
        flexBasis : '50%',
        display : 'flex',
        justifyContent : 'flex-end',
        alignItems : 'center'
    },
    cart : {
        height : '100%',
        display : 'flex',
        alignItems : 'center',
        marginRight : 15
    },
    cartTotal : {
        fontSize : 16,
        marginLeft : 15
    },
    link : {
        textDecoration : 'none',
        paddingLeft : '3%'
    }
}

export default Navbar