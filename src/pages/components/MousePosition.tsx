import react, { useEffect, useState } from 'react';

export const MousePosition = () => {

    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    // 獲取滑鼠的位置
    const handleMouseMove = (event: MouseEvent) => {
        setMouseX(event.clientX);
        setMouseY(event.clientY);
    };

    useEffect(() => {
        // 當滑鼠移動時，觸發 handleMouseMove
        window.addEventListener("mousemove", handleMouseMove);
    });

    return (
        <div>
            <div>Mouse X {mouseX}</div>
            <div>Mouse Y {mouseY}</div>
        </div>
    );
};