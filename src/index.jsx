import React  from 'react';
import tumblr from 'tumblr.js';

class HelloWorld extends React.Component {
    render() {
        return <p>Hello, someone!</p>;
    }
}
 
React.render(<HelloWorld />, document.getElementById('content'));

let client = tumblr.createClient({ consumer_key: 'srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz' });

client.tagged('lol', function (err, data) {
    debugger;
});