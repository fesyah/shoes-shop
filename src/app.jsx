import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Login } from './actions'

// import component
import Navbar from './components/navbar'
import Footer from './components/footer'

// import pages
import Home from './pages/home'
import LogIn from './pages/login'
import Register from './pages/register'
import ProductDetails from './pages/productDetails'
import UserCart from './pages/userCart'
import Dashboard from './pages/adminDashboard'
import NotFound from './pages/404'

class App extends React.Component {
    componentDidMount () {
        // keep login
        Axios.get(`http://localhost:2000/users?id=${localStorage.getItem('id')}`)
        .then(res => {
            this.props.Login(res.data[0])
        })
        .catch(err => console.log(err))

    }

    render () {
        console.log(this.props.role)
        if (this.props.role === 'admin') {
            return (
                <div>
                    <Navbar/>
                    <Switch>
                        <Route path='/' component={Home} exact/>
                        <Route path='/login' component={LogIn}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/dashboard' component={Dashboard}/> 
                        <Route path='*' component={NotFound}/>
                    </Switch>
                    <Footer/>
                </div>
            )
        } else {
            return (
                <div>
                    <Navbar/>
                    <Switch>
                        <Route path='/' component={Home} exact/>
                        <Route path='/login' component={LogIn}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/details' component={ProductDetails}/>
                        <Route path='/cart' component={UserCart}/>
                        <Route path='*' component={NotFound}/>
                    </Switch>
                    <Footer/>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        role : state.user.role
    }
}

export default connect(mapStateToProps, { Login })(App)