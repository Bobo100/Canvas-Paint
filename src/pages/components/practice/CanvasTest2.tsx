import React, { useEffect, useRef, useState } from "react";

interface Props {
    history: Path2D[];
    color: string[];
}

interface Props2 {
    history: {
        path: Path2D;
        color: string;
    }
}


export const CanvasTest2 = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [rangeValue, setRangeValue] = useState(50);
    const propsRef = useRef<Props>({ history: [], color: [] });


    // 查看顏色用
    // useEffect(() => {
    //     console.log(color)
    // }, [color])

    const startDrawing = (x: number, y: number) => {
        const path = new Path2D();
        path.moveTo(x, y);
        setIsDrawing(true);

        propsRef.current.color.push(color);
        propsRef.current.history.push(path);
    };

    const draw = (x: number, y: number) => {
        if (!isDrawing) return;
        const path = propsRef.current.history[propsRef.current.history.length - 1];

        path.lineTo(x, y);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        propsRef.current.history.forEach((path, index) => { context.strokeStyle = propsRef.current.color[index]; context.stroke(path); });
        context.stroke(path);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        console.log(propsRef)
    };

    const handleUndo = () => {
        propsRef.current.history.pop();
        propsRef.current.color.pop();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        propsRef.current.history.forEach((path, index) => { context.strokeStyle = propsRef.current.color[index]; context.stroke(path); });
    };


    // 還沒寫完
    const handleRedo = () => {
        propsRef.current.history.pop();
        propsRef.current.color.pop();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        propsRef.current.history.forEach((path, index) => { context.strokeStyle = propsRef.current.color[index]; context.stroke(path); });
    };

    //
    const handleClear = () => {
        propsRef.current.history = [];
        propsRef.current.color = [];

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setRangeValue(parseInt(e.target.value, 10));
    // };

    return (
        <div className="canvas-container">
            <div className="tool-list">
                <div className="list list_btn">
                    <button onClick={handleUndo}>上一步驟</button>
                    <button onClick={handleUndo}>下一步驟</button>
                    <button onClick={handleClear}>清除</button>
                </div>

                <div className="list">
                    <label htmlFor="color">選擇顏色</label>
                    <input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    <div>{color}</div>
                </div>

                <div className="list">
                    <label htmlFor="range">選擇粗細</label>
                    {/* <input id="range" type="range" min="0" max="100" value={rangeValue} onChange={handleChange} /> */}
                    <input id="range" type="range" min="0" max="100" value={rangeValue} onChange={(e) => setRangeValue(parseInt(e.target.value))} />
                    <div>{rangeValue}</div>
                </div>
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
