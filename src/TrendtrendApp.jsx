import React, { Component, PropTypes }  from 'react';
import { connect } from 'react-redux';
import RequestTagSection from './components/RequestTagSection';
import FindAssetsSection from './components/FindAssetsSection';
import LoadAssetsSection from './components/LoadAssetsSection';
import PlayAnimationSection from './components/PlayAnimationSection';

@connect(state => ({
    currentPhase: state.currentPhase
}))
export default class TrendtrendApp extends Component {
    static propTypes = {
        currentPhase: PropTypes.string.isRequired
    };

    render() {
        // at the moment, don't know an alternative to switch
        let currentSection;
        switch (this.props.currentPhase) {
            case ('findAssets'):
                currentSection = <FindAssetsSection />;
                break;               
            case ('loadAssets'):
                currentSection = <LoadAssetsSection />;
                break;              
            case ('playAnimation'):
                currentSection = <PlayAnimationSection />;
                break;
            case ('requestTag'):
            default:
                currentSection = <RequestTagSection />;
        }

        return (
            <div>
                {currentSection}
            </div>
        );
    }
}