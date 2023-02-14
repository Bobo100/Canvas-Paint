import React, { useEffect, useRef, useState } from "react";
interface Point {
    x: number;
    y: number;
}



export const CanvasDrawOneDot = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<Point[]>([]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        // 如果 canvasRef.current 為 null，則 return
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 如果 context 為 null，則 return
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        // 將點加入 points
        setPoints([...points, { x, y }]);

        // 畫出點
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
    };


    const handleUndo = () => {
        // 如果 canvasRef.current 為 null，則 return
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        // 將最後一個點從 points 移除
        // const newPoints = points.slice(0, points.length - 1);
        const newPoints = points.slice(0, -1);
        setPoints(newPoints);

        // 清除畫布
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 畫出點
        newPoints.forEach((point) => {
            context.beginPath();
            context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            context.fillStyle = "red";
            context.fill();
        });

    };

    return (
        <div className="canvas-container">
            <div className="tool-list">
                <button onClick={handleUndo}>上一步驟</button>
                <button>123</button>
            </div>

            <div className="flex">
                <canvas ref={canvasRef} width={400} height={400} onClick={handleCanvasClick} />

                <div className="tool-sidelist">
                    <button>123</button>
                    <button>123</button>
                    <button onClick={handleUndo}>上一步驟</button>
                </div>
            </div>
        </div>
    );
};

export default CanvasDrawOneDot;
