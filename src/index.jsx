import React, { Component }             from 'react';  
import { createStore, applyMiddleware } from 'redux';  
import { Provider }                     from 'react-redux';
import thunk                            from 'redux-thunk';
import { Router, Route, IndexRoute }    from 'react-router';
import createBrowserHistory             from 'history/lib/createBrowserHistory';

import mainReducer                      from './reducers';

import TrendtrendApp                    from './TrendtrendApp';  
import RequestTagSection                from './components/RequestTagSection';
import FindAssetsSection                from './components/FindAssetsSection';
import LoadAssetsSection                from './components/LoadAssetsSection';
import ImageAnimationHandler            from './components/ImageAnimationHandler';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(mainReducer);

// routes are here because I get an error when trying to import
const routes = (
    <Route path="/" component={TrendtrendApp}>
        <IndexRoute component={RequestTagSection} />
        <Route path="/find-assets" component={FindAssetsSection} />
        <Route path="/load-assets" component={LoadAssetsSection} />
        <Route path="/play-animation" component={ImageAnimationHandler} />
    </Route>
);

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                { () => <Router history={ createBrowserHistory() } routes={ routes } /> }
            </Provider>
        );
    }
}

React.render(<Root />, document.getElementById('content'));
