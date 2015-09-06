import React from 'react';
import superagent from 'superagent';
import superagentJSONP from 'superagent-jsonp';
superagentJSONP(superagent);

class HelloWorld extends React.Component {
    render() {
        return <p>Hello, someone!</p>;
    }
}
 
React.render(<HelloWorld />, document.getElementById('content'));

superagent.get('https://api.tumblr.com/v2/tagged?tag=lol&api_key=srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz').jsonp().end(function(){
  debugger; 
});