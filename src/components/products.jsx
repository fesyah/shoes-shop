import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    Card,
    CardActionArea,
    CardMedia,
    Typography,
    CardActions,
    CardContent,
    Button
} from '@material-ui/core'

import { getDataProducts } from '../actions'

class Products extends React.Component {
    // constructor (props) {
    //     super(props)
    //     this.state = {
    //         products : []
    //     }
    // }

    componentDidMount () {
        Axios.get('http://localhost:2000/products')
        .then(res => {
            // this.setState({products : res.data})
            this.props.getDataProducts(res.data)
        })
        .catch(err => console.log(err))
    }

    renderCard = () => {
        return this.props.product.map((item, index) => {
            return (
                <Card style={styles.card} key={item.id}>
                    <CardActionArea style={styles.contentArea}>
                        <CardMedia image={item.images[0]} component="img" style={styles.contentImage}/>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {item.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {`Rp ${item.price}, 00`}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions style={styles.contentActions}>
                        <Link to={`/details?id=${item.id}`} style={styles.link}>
                            <Button size="small" color="primary">
                                Buy Now
                            </Button>
                        </Link>
                        <Button size="small" color="secondary">
                            Wish List
                        </Button>
                    </CardActions>
                </Card>
            )
        })
    }

    render () {
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>Products</h1>
                <div style={styles.cardContainer}>
                    {this.renderCard()}
                </div>
            </div>
        )
    }
}

const styles = {
    root : {
        height : 'auto',
        width : '100%',
        backgroundColor : '#f2f2f2',
        padding : '2% 7%'
    },
    title : {
        fontSize : 50,
        fontWight : 600,
        margin : '2% 0px'
    },
    cardContainer : {
        width : '100%',
        display : 'flex',
        flexWrap : 'wrap',
        justifyContent : 'flex-start'
    },
    card : {
        flexBasis : '19%',
        minWidth : '300px',
        marginBottom : '1%',
        marginRight : '1%'
    },
    contentArea : {
        height : '87%',
        padding : '1%'
    },
    contentImage : {
        width : '100%',
        padding : '5%'
    },
    contentActions : {
        height : '13%',
        alignItems : 'center'
    },
    link : {
        textDecoration : 'none'
    }
}

const mapStateToProps = (state) => {
    return {
        product : state.product
    }
}

export default connect(mapStateToProps, { getDataProducts })(Products)