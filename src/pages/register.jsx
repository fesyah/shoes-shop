import React from 'react'
import Axios from 'axios'
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

class Register extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            visible : false,
            numb : true, 
            special : true,
            min : true,
            match : false,
            password : '',
            redirect : false,
            errorUsername : false
        }
    }

    handleRegister = () => {
        let username = this.username.value
        let email = this.email.value
        let password = this.state.password
        let confPassword = this.confPassword.value

        // check input
        if (username === '' || email === '' || password === '' || confPassword === '') return

        // check password and confirm password 
        if (password !== confPassword) {
            return this.setState({match : true})
        }

        // check username if its already used ?
        Axios.get(`http://localhost:2000/users?username=${username}`)
        .then(res => {
            if(res.data.length !== 0) { // username already used
                this.setState({errorUsername : true})
            } else {
                // post data
                Axios.post('http://localhost:2000/users', 
                {
                username, 
                email, 
                password, 
                role : 'user',
                cart : []
                })
                .then(res => {
                    console.log(res.data)
                    this.setState({redirect : true})
                })
                .catch(err => console.log(err))
            }
        })
    }

    handlePassword = (e) => {
        // console.log(e.target.value)
        let password = e.target.value
        
        // password validation
        let number = /[0-9]/
        let specialChar = /[!@#$%^&*;]/

        // test password
        let testNumber = number.test(password)
        let testSpecial = specialChar.test(password)
        let testMin = password.length >= 6


        //  includes number
        if (testNumber) {
            this.setState({numb : false})
        } else {
            this.setState({numb : true})
        }

        // include spceial character
        if (testSpecial) {
            this.setState({special : false})
        } else {
            this.setState({special : true})
        }

        if (testMin) {
            this.setState({min : false})
        } else {
            this.setState({min : true})
        }

        this.setState({password : e.target.value})

    }

    render () {
        const { visible, match, redirect, errorUsername } = this.state

        if (redirect) {
            return <Redirect to='/login'/>
        }

        return (
            <div style={styles.root}>
                <Paper style={styles.paper} elevation={3}>
                    <h1 style={styles.title}>Register</h1>
                    {/* input username */}
                    <TextField 
                        label="Username" 
                        variant="outlined" 
                        style={styles.input}
                        inputRef={(username) => this.username = username}
                        helperText={errorUsername ? "* username already used." : ""}
                        error={errorUsername}
                    />
                    <TextField 
                        label="Email" 
                        variant="outlined" 
                        style={styles.input}
                        inputRef={(email) => this.email = email}
                        // helperText="* email is already used."
                        // error
                    />
                    {/* input password */}
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            type={visible ? "text" : "password"}
                            onChange={ (e) => this.handlePassword(e) }
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
                    </FormControl>
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            type={visible ? "text" : "password"}
                            inputRef={(confPassword) => this.confPassword = confPassword}
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
                            labelWidth={135}
                        />
                        <FormHelperText style={styles.error}>{!match ? '' : '* password doesn\'t match'}</FormHelperText>
                    </FormControl>
                    <h5 style={styles.info}>Already have account? or SignIn</h5>
                    <Button style={styles.button} onClick={this.handleRegister}>Create Account</Button>
                </Paper>
            </div>
        )
    }
}

const styles = {
    root : {
        height : 'calc(100vh - 50px)',
        width : '100%',
        backgroundColor : '#f2f2f2',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        paddingTop : 90,
        backgroundImage : 'url(https://images.wallpapersden.com/image/download/adidas-sneakers-shoes_21312_1920x1080.jpg)',
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover',
    },
    paper : {
        height : '80vh',
        width : '45vw',
        padding : '2% 8%',
        display : 'flex',
        flexDirection : 'column'
    },
    title : {
        fontSize : 50,
        marginBottom : '5%',
        alignSelf : 'center'
    },
    input : {
        margin : '2% 0px'
    },
    info : {
        margin : '2% 0px',
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
        marginTop : '1.5%'
    }
}

export default Register