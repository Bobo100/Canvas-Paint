import react from 'react';
import { CanvasTest } from './components/practice/CanvasTest';
import { MousePosition } from './components/MousePosition';
import { CanvasTest2 } from './components/practice/CanvasTest2';

export const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <MousePosition />
            {/* <CanvasTest /> */}
            <CanvasTest2/>
        </div>
    );
};
