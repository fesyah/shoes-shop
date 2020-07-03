import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardContent
} from '@material-ui/core'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history : []
        }
    }

    componentDidMount () {
        Axios.get('http://localhost:2000/transaction_history')
        .then(res => {
            console.log(res.data)
            this.setState({history : res.data})
        })
        .catch(err => console.log(err))
    }

    renderTableHead = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Products</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    renderTableBody = () => {
        return this.state.history.map((item, index) => {
            return (
                <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.userID}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                        {
                            item.products.map((value, index) => {
                                return (
                                    <Card style={styles.card} elevation={3}>
                                        <CardContent style={styles.cardContent}>
                                            <h4>{value.name}</h4>
                                            <h5>Brand : {value.brand}</h5>
                                            <h5>Color : {value.color}</h5>
                                            <h5>Price : Rp. {value.price},00</h5>
                                            <h5>Size : {value.size}</h5>
                                            <h5>Quantity : {value.qty}</h5>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </TableCell>
                </TableRow>
            )
        })
    }
    
    render () {
        
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>Transaction History</h1>
                <Table style={styles.table}>
                    {this.renderTableHead()}
                    <TableBody>{this.renderTableBody()}</TableBody>
                </Table>
            </div>
        )
    }
}

const styles = {
    root : {
        minHeight : 'calc(100vh - 70px)',
        backgroundColor : '#f2f2f2',
        padding : '90px 10% 3% 10%'
    },
    title : {
        margin : '2% 0px'
    },
    table : {
        backgroundColor : 'white'
    },
    card : {
        backgroundColor : '#130f40'
    },
    cardContent : {
        color : 'white'
    }
}

const mapStateToProps = (state) => {
    return {
        role : state.user.role
    }
}

export default connect(mapStateToProps)(Dashboard)