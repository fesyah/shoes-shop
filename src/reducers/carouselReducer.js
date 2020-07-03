export const carouselReducer = (state = [], action) => {
    console.log('carousel reducer')
    switch(action.type) {
        case 'GET_DATA_CAROUSEL' :
            return action.payload
        default :
            return state
    }
}