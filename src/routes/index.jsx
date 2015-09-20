import React                 from 'react';  
import { Route, IndexRoute } from 'react-router';
import TrendTrendApp         from '../TrendTrendApp';

// route components
import RequestTagSection     from '../components/RequestTagSection';
import FindAssetsSection     from '../components/FindAssetsSection';
import LoadAssetsSection     from '../components/LoadAssetsSection';
import ImageAnimationHandler from '../components/ImageAnimationHandler';

export const routes = (
    <Route path="/" component={ TrendTrendApp }>
        <IndexRoute component={ RequestTagSection } />
        <Route path="find-assets" component={ FindAssetsSection } />
        <Route path="load-assets" component={ LoadAssetsSection } />
        <Route path="play-animation" component={ ImageAnimationHandler } />
    </Route>
);