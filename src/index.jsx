import React, { Component }             from 'react';  
import { createStore } from 'redux';  
import { Provider }                     from 'react-redux';
import TrendtrendApp                    from './TrendtrendApp';  
import mainReducer                      from './reducers';

const store = createStore(mainReducer);

export default class App extends Component {  
    render() {
        return (
            <div>
                <Provider store={store}>
                    { () => <TrendtrendApp /> }
                </Provider>
            </div>
        );
    }
}

React.render(<App />, document.getElementById('content'));
