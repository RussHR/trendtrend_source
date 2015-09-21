import React, { Component }             from 'react';  
import { createStore, applyMiddleware } from 'redux';  
import { Provider }                     from 'react-redux';
import thunk                            from 'redux-thunk';
import TrendtrendApp                    from './TrendtrendApp';  
import mainReducer                      from './reducers';
import {Router, Route, IndexRoute } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import FindAssetsSection                    from './components/FindAssetsSection';  


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(mainReducer);

const routes = (
    <Route path="/" component={TrendtrendApp}>
        <IndexRoute component={FindAssetsSection} />
        <Route path="/hm" component={FindAssetsSection} />
    </Route>
);

export default class App extends Component {  
    render() {
        return (
            <Provider store={store}>
                { () => <Router history={createHistory()} routes={routes} /> }
            </Provider>
        );
    }
}

React.render(<App />, document.getElementById('content'));
