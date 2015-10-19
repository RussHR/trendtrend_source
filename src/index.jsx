import React, { Component }             from 'react';  
import { createStore, applyMiddleware } from 'redux';  
import { Provider }                     from 'react-redux';
import thunk                            from 'redux-thunk';

import mainReducer                      from './reducers';

import TrendtrendApp                    from './TrendtrendApp';  

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(mainReducer);

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                { () => <TrendtrendApp /> }
            </Provider>
        );
    }
}

React.render(<Root />, document.getElementById('content'));
