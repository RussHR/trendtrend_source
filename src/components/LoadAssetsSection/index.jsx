import React, { Component, PropTypes } from 'react';
import ContentCenter        from '../ContentCenter';

export default class LoadAssetsSection extends Component {
    static propTypes = {
        imageSrcs: PropTypes.array.isRequired,
        loadedImageCount: PropTypes.number.isRequired,
        onLoadImage: PropTypes.func.isRequired
    };
    render() {
        const { imageSrcs, loadedImageCount, onLoadImage } = this.props;

        const images = imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                key={ i } 
                onLoad={ onLoadImage }
                style={{ display: 'none' }} />
            );
        });

        return (
            <ContentCenter>
                <span>Loaded Image Count: { loadedImageCount }/20</span>
                {images}
            </ContentCenter>
        );
    }
}