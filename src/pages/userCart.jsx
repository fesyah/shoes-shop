import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    TextField,
    Typography
} from '@material-ui/core'

import { Login } from '../actions'

class UserCart extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            alert : false,
            error : false
        }
    } 

    handleDelete = (index) => {
        console.log(index)

        let tempCart = this.props.cart
        tempCart.splice(index, 1)

        // update data in database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : tempCart })
        .then(res => {
            console.log(res.data)

            // update data redux
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then(res => {
                console.log(res.data)
                this.props.Login(res.data)
            })
        })
        .catch(err => console.log(err))
    }

    handleCheckOut = () => {
        console.log('check out')

        if (this.props.cart.length === 0) return
        
        this.setState({alert : true})
    }

    handleClose = () => {
        this.setState({alert : false})
    }

    handleOk = () => {
        console.log('user confirm')
        let history = {
            userID : this.props.id,
            date : new Date().toLocaleString(),
            total : this.props.cart.map(item => item.total).reduce((a, b) => a + b),
            products : this.props.cart
        }
        console.log(history)

        // check password confirmation
        let password = this.password.value
        Axios.get(`http://localhost:2000/users?id=${this.props.id}&password=${password}`)
        .then(res => {
            console.log(res.data)
            if(res.data.length === 0) { // invalid password
                this.setState({error : true})
            } else {
                // update database
                Axios.post('http://localhost:2000/transaction_history', history)
                .then(res => {
                    console.log(res.data)
        
                    // update cart user => []
                    Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : [] })
                    .then(res => {
                        console.log(res.data)

                        // update data redux
                        Axios.get(`http://localhost:2000/users/${this.props.id}`)
                        .then(res => {
                            console.log(res.data)
                            this.props.Login(res.data)
                            this.setState({alert : false, error : false})
                        })

                    })
                })
            }
        })
        .catch(err => console.log(err))
    }

    renderTableHead = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    renderTableBody = () => {
        return this.props.cart.map((item, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <img src={item.image} width="70px" alt="product-img"/>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                        <Button 
                            color="secondary" 
                            variant="contained"
                            onClick={() => this.handleDelete(index)}
                        >Delete</Button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    render () {
        const { alert, error } = this.state
        console.log(this.props.cart)
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>User Cart</h1>
                <Table style={{backgroundColor : 'white'}}>
                    {this.renderTableHead()}
                    <TableBody>{this.renderTableBody()}</TableBody>
                </Table>
                <Button 
                    variant="contained" 
                    style={styles.buttonCheckOut}
                    onClick={this.handleCheckOut}
                >
                    Check Out
                </Button>
                <Dialog
                    open={alert}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography>Are you sure to confirm this payment?</Typography>
                            <TextField
                                label="password"
                                type="password"
                                inputRef={(password) => this.password = password}
                                style={{width : '100%', margin : '2%'}}
                                error={error ? true : false}
                                helperText={error ? "* invalid password" : ""}
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleOk} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const styles = {
    root : {
        height : 'calc(100vh - 70px)',
        backgroundColor : '#f2f2f2',
        padding : '90px 10% 3% 10%'
    },
    title : {
        margin : '2% 0px'
    },
    ul : {
        listStyle : 'none'
    },
    buttonCheckOut : {
        marginTop : '3%',
        color : 'white',
        backgroundColor : '#130f40'
    }
}

const mapStateToProps = (state) => {
    return {
        cart : state.user.cart,
        id : state.user.id,
        product : state.product
    }
}

export default connect(mapStateToProps, { Login })(UserCart)