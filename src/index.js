import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import './index.css'
import App from './app'

// setup redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Reducers from './reducers'

// create global store
let globalStore = createStore(Reducers)
globalStore.subscribe(() => console.log('global storage : ',  globalStore.getState()))

ReactDOM.render(
    <Provider store={globalStore}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
    ,document.getElementById('root')
)