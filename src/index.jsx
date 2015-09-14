import React, { Component }             from 'react';  
import { createStore, applyMiddleware } from 'redux';  
import { Provider }                     from 'react-redux';
import thunk                            from 'redux-thunk';
import TrendtrendApp                    from './TrendtrendApp';  
import mainReducer                      from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(mainReducer);

export default class App extends Component {  
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

React.render(<App />, document.body);
