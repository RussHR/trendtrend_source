import React, { Component }             from 'react';  
import { createStore, applyMiddleware } from 'redux';  
import { Provider }                     from 'react-redux';
import thunk                            from 'redux-thunk';
import { Router, Route, IndexRoute }    from 'react-router';
import createHistory                    from 'history/lib/createBrowserHistory';

import mainReducer                      from './reducers';

import TrendtrendApp                    from './TrendtrendApp';  
import FindAssetsSection                from './components/FindAssetsSection';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(mainReducer);

// routes are here because I get an error when trying to import
const routes = (
    <Route path="/" component={TrendtrendApp}>
        <IndexRoute component={FindAssetsSection} />
        <Route path="/hm" component={FindAssetsSection} />
    </Route>
);

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                { () => <Router history={createHistory()} routes={routes} /> }
            </Provider>
        );
    }
}

React.render(<Root />, document.getElementById('content'));
