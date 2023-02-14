import React, { useEffect, useRef, useState } from "react";

export const CanvasTest = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const historyRef = useRef<Path2D[]>([]);
    const [color, setColor] = useState("#000000");

    const startDrawing = (x: number, y: number) => {
        const path = new Path2D();
        path.moveTo(x, y);
        setIsDrawing(true);
        historyRef.current.push(path);
    };

    const draw = (x: number, y: number) => {
        if (!isDrawing) return;

        const path = historyRef.current[historyRef.current.length - 1];
        path.lineTo(x, y);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        context.strokeStyle = color;
        historyRef.current.forEach((path) => context.stroke(path));
        context.stroke(path);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleUndo = () => {
        historyRef.current.pop();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        context.strokeStyle = color;
        historyRef.current.forEach((path) => context.stroke(path));
    };

    return (
        <div className="canvas-container">
            <div className="tool-list">
                <button onClick={handleUndo}>上一步驟</button>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>

            <div className="flex">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={(e) => startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                    onMouseMove={(e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                    onMouseUp={handleMouseUp}
                />


                <div className="tool-sidelist">
                    <button onClick={handleUndo}>Undo</button>
                </div>
            </div>
        </div>
    );
};
