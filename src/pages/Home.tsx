import react from 'react';
import { CanvasTest } from './components/practice/CanvasTest';
import { MousePosition } from './components/MousePosition';
import { CanvasTest2 } from './components/practice/CanvasTest2';
import { CanvasTest3 } from './components/practice/CanvasTest3';

export const Home = () => {
    return (
        <div>
            <h1>親，小畫家上線啦</h1>
            <MousePosition />
            {/* <CanvasTest /> */}
            <CanvasTest2 />
            {/* <CanvasTest3 /> */}
        </div>
    );
};
