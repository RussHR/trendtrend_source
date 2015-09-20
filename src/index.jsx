import React, { Component }             from 'react';  
import { createStore, applyMiddleware, compose } from 'redux';  
import { Provider }                     from 'react-redux';
import { reduxReactRouter } from 'redux-router';
import thunk                            from 'redux-thunk';
import TrendtrendApp                    from './TrendtrendApp';  
import mainReducer                      from './reducers';
import createHistory from 'history/lib/createBrowserHistory';

const createStoreWithMiddleware = compose(
    applyMiddleware(thunk),
    reduxReactRouter({ createHistory })
)(createStore);
const store = createStoreWithMiddleware(mainReducer);

export default class Root extends Component {  
    render() {
        return (
            <div id="content">
                <Provider store={store}>
                    { () => <TrendtrendApp /> }
                </Provider>
            </div>
        );
    }
}

React.render(<Root />, document.body);
