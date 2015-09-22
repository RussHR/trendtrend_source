import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

@connect(state => ({
    imageSrcs: state.imageSrcs
}))
export default class ImageAnimationHandler extends React.Component {
    static propTypes ={
        imageSrcs: (props, propName, componentName) => {
            if (props[propName].length !== 20) {
                return new Error(
                    `imageSrcs requires 20 URLs. It only has ${ props[propName].length }.`
                );
            }
        },
        dispatch: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired
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