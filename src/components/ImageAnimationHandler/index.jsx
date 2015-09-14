import React, { Component, PropTypes } from 'react';

export default class TrendtrendApp extends React.Component {
    static propTypes ={
        imageSrcs: PropTypes.array.isRequired
    };
    render() {
        let images = this.props.imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                key={ i } />
            );
        });
        
        return (
            <div>
                { images }
            </div>
        );
    }
}