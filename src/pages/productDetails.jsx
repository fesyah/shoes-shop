import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { 
    Button, 
    Paper,
    Dialog,
    DialogActions,
    DialogContentText,
    DialogContent,
    DialogTitle
} from '@material-ui/core'

import { Login } from '../actions'

class ProductDetails extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            product : {},
            image : '',
            stock : 0,
            toLogin : false,
            selectedSize : null,
            total : 0,
            size : null,
            toCart : false,
            alert : false
        }
    }
    
    componentDidMount () {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
        .then(res => {
            // console.log(res.data)
            this.setState({product : res.data[0], image : res.data[0].images[0]})
        })
        .catch(err => console.log(err))
    }

    handleAddToCart = () => {
        const { total, product, size, selectedSize } = this.state
        // console.log('handle add to cart')

        // check user input
        if (size === null || total === 0) {
            this.setState({alert : true})
            return
        }

        // check if user already sigin ?
        if (!this.props.id) {
            this.setState({toLogin : true})
        } else {
            console.log('user already login')
            let cartData = {
                name : product.name,
                image : product.images[0],
                brand : product.brand,
                color : product.colour,
                size : size,
                qty : total,
                total : total * product.price,
                price : product.price,
                id : product.id,
                index : selectedSize
            }

            let tempCart = this.props.cart
            tempCart.push(cartData)
            
            // update user cart in database
            Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart : tempCart })
            .then(res => {
                console.log(res.data)

                // update data redux
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                .then(res => {
                    this.props.Login(res.data)
                    this.setState({toCart : true})
                })
            })
            .catch(err => console.log(err))
        }
    }

    handleClose = () => {
        this.setState({alert : false})
    }

    render () {
        // console.log(this.props.location)
        // console.log(this.props.location.search)

        const { product, image, stock, toLogin, selectedSize, total, alert, toCart } = this.state
        // console.log(image)

        if (toLogin) {
            return <Redirect to='/login'/>
        } else if (toCart) {
            return <Redirect to='/cart'/>
        }
        
        return (
            <div style={styles.root}>
                <Paper elevation={3} style={{ backgroundImage : `url(${image})`,...styles.leftContent}}></Paper>
                <div style={styles.rightContent}>
                    <h1 style={styles.info}>Name : {product.name}</h1>
                    <h1 style={styles.info}>Category : {product.category}</h1>
                    <h1 style={styles.info}>Brand : {product.brand}</h1>
                    <h1 style={styles.info}>Color : {product.colour}</h1>
                    <h1 style={styles.info}>Description : </h1>
                    <h1 style={styles.decs}>{product.description}</h1>
                    <h1 style={styles.info}>Size : </h1>
                    <div>
                        {
                            (product.stock ? product.stock : []).map((item, index) => {
                                return <Button 
                                            key={index} 
                                            variant="outlined"
                                            onClick={() => this.setState({stock : item.total, selectedSize : index, size : item.code})}
                                            style={{
                                                backgroundColor : selectedSize === index ? '#130f40' : '',
                                                color : selectedSize === index ? 'white' : 'black',
                                                ...styles.sizeButton
                                            }}
                                        >{item.code}</Button>
                            })
                        }
                    </div>
                    <h5 style={styles.stockInfo}>{stock ? `* stock = ${stock}` : ''}</h5>
                    <h1 style={styles.info}>Total : </h1>
                    <div style={styles.total}>
                        <Button
                            disabled={total <= 0 ? true : false}
                            onClick={() => this.setState({total : total-1})}
                        >-</Button>
                        <h1 style={styles.totalInfo}>{total}</h1>
                        <Button
                            disabled={total >= stock ? true : false}
                            onClick={() => this.setState({total : total+1})}
                        >+</Button>
                    </div>
                    <Button style={styles.button} onClick={this.handleAddToCart}>Add to Cart</Button>
                </div>
                <Dialog
                    open={alert}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"⚠ Warning !"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please choose your size, look at the stock if its avaiable, and input total or quantity min = 1.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Ok
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
        padding : '120px 10% 3% 10%',
        display : 'flex',
        alignItems : 'center'
    },
    leftContent : {
        height : '100%',
        flexBasis : '50%',
        backgroundColor : 'white',
        backgroundRepeat : 'no-repeat',
        backgroundSize : '100% auto',
        backgroundPosition : 'center',
        zIndex : 5
    },
    rightContent : {
        height : '100%',
        flexBasis : '50%',
        backgroundColor : 'white',
        padding : '3%',
        display : 'flex',
        flexDirection : 'column',
        position : 'relative'
    },
    info : {
        fontSize : 19,
        marginBottom : '2%',
        fontWeight : 600,
        textTransform : 'capitalize'
    },
    decs : {
        fontSize : 18,
        marginBottom : '2%',
        fontWeight : 400 
    },
    button : {
        backgroundColor : '#130f40',
        color : 'white',
        width : '30%',
        alignSelf : 'flex-end',
        marginTop : '5%',
        position : 'absolute',
        bottom : '5%'
    },
    sizeButton : {
        marginRight : 10,
        marginTop : 10
    },
    stockInfo : {
        margin : '2%',
        color : 'red',
        fontSize : 16
    },
    total : {
        display : 'flex',
        alignItems : 'center'
    },
    totalInfo : {
        margin : '0px 2%'
    }
}

const mapStateToProps = (state) => {
    return {
        id : state.user.id,
        cart : state.user.cart
    }
}

export default connect(mapStateToProps, { Login })(ProductDetails)