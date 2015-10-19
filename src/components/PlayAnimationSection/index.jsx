import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators                           from '../../actions';

@connect(state => ({
    imageSrcs: state.imageSrcs
}))
export default class ImageAnimationSection extends Component {
    static propTypes ={
        imageSrcs: (props, propName, componentName) => {
            if (props[propName].length !== 20) {
                return new Error(
                    `imageSrcs requires 20 URLs. It only has ${ props[propName].length }.`
                );
            }
        },
        dispatch: PropTypes.func.isRequired
    };

    componentWillMount() {
        const { imageSrcs, dispatch, history } = this.props;
        if (imageSrcs.length < 20) dispatch(ActionCreators.goToRequestTag(history));
    }
    
    render() {
        let images = this.props.imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                height="100"
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