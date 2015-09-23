import React, { Component }             from 'react';  
import { createStore, applyMiddleware } from 'redux';  
import { Provider }                     from 'react-redux';
import thunk                            from 'redux-thunk';
import { Router, Route, IndexRoute }    from 'react-router';
import createHashHistory                from 'history/lib/createHashHistory';

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
        <Route path="find-assets/:tag" component={FindAssetsSection} />
        <Route path="load-assets" component={LoadAssetsSection} />
        <Route path="play-animation" component={ImageAnimationHandler} />
        <Route path="*" component={RequestTagSection} />
    </Route>
);

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                { () => <Router history={ createHashHistory({ queryKey: false }) } routes={ routes } /> }
            </Provider>
        );
    }
}

React.render(<Root />, document.getElementById('content'));
