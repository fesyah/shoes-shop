import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { 
    Paper, 
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    TextField,
    Button
} from '@material-ui/core'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { Login } from '../actions'

class LogIn extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            visible : false,
            loginError : false
        }
    }

    handleLogin = () => {
        let username = this.username.value
        let password = this.password.value

        // get user data using login data
        Axios.get(`http://localhost:2000/users?username=${username}&password=${password}`)
        .then((res) => {
            if (res.data.length === 0) { // check error
                this.setState({loginError : true})
            } else {
                // set global storage
                localStorage.setItem('id', res.data[0].id)
                
                // invoke action
                this.props.Login(res.data[0])

                this.setState({loginError : false})
            }
        })
        .catch((err) => console.log(err))
    }

    render () {
        const { visible, loginError } = this.state
        console.log(this.props.username)

        // redirect
        if (this.props.username) {
            return <Redirect to='/'/>
        }
        
        return (
            <div style={styles.root}>
                <Paper style={styles.paper} elevation={3}>
                    <h1 style={styles.title}>Login</h1>
                    {/* input username */}
                    <TextField 
                        id="outlined-basic" 
                        label="Username" 
                        variant="outlined" 
                        style={styles.input}
                        inputRef={(username) => this.username = username}
                    />
                    {/* input password */}
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={visible ? "text" : "password"}
                            inputRef={(password) => this.password = password}
                            helperText="Incorrect entry."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={() => this.setState({visible : !visible})}
                                    >
                                        { visible ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <FormHelperText style={styles.error}>{loginError ? '* username or password is invalid' : ''}</FormHelperText>
                    </FormControl>
                    <h5 style={styles.info}>Didn't have Account ? Sign Up</h5>
                    <Button style={styles.button} onClick={this.handleLogin}>Login</Button>
                </Paper>
            </div>
        )
    }
}

const styles = {
    root : {
        height : 'calc(100vh - 70px)',
        width : '100%',
        backgroundColor : '#f2f2f2',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        paddingTop : 80,
        backgroundImage : 'url(https://images.wallpapersden.com/image/download/adidas-sneakers-shoes_21312_1920x1080.jpg)',
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover',
    },
    paper : {
        height : '70vh',
        width : '45vw',
        padding : '5% 8%',
        display : 'flex',
        flexDirection : 'column'
    },
    title : {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize : 50,
        marginBottom : '5%',
        alignSelf : 'center'
    },
    input : {
        margin : '2% 0px'
    },
    info : {
        margin : '3% 0px',
        textDecoration: 'none', 
        color : '#1d1b38',
        alignSelf : 'center'
    },
    button : {
        width : '100%',
        backgroundColor : '#130f40',
        color : 'white',
        marginTop : '7%',
        alignSelf : 'center'
    },
    error : {
        color : 'red',
        marginTop : '2%'
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username
    }
}

export default connect(mapStateToProps, { Login })(LogIn)