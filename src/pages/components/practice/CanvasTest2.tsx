import React, { useEffect, useRef, useState } from "react";

interface Props {
    history: Path2D[];
    color: string[];
}

interface Props2 {
    history: {
        path: Path2D;
        color: string;
        rangeValue: number;
    }[]
}


export const CanvasTest2 = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [rangeValue, setRangeValue] = useState(1);
    // const propsUndoRef = useRef<Props>({ history: [], color: [] });
    const propsUndoRef = useRef<Props2>({ history: [] });
    const propsCurrentRef = useRef<Props2>({ history: [] });
    const propsRedoRef = useRef<Props2>({ history: [] });

    const [clear, setClear] = useState(false);

    // 查看顏色用
    // useEffect(() => {
    //     console.log(color)
    // }, [color])

    console.log(propsCurrentRef.current.history)


    const startDrawing = (x: number, y: number) => {
        const path = new Path2D();
        path.moveTo(x, y);
        setIsDrawing(true);

        propsCurrentRef.current.history.push({ path, color, rangeValue });

        // 如果你有做過 undo，那麼你再做一次畫圖的動作，就要把 redo 的陣列清空                  
        if (propsRedoRef.current.history.length > 0) {
            propsRedoRef.current.history = [];
        }
    };

    const draw = (x: number, y: number) => {

        if (!isDrawing) return;
        const path = propsCurrentRef.current.history[propsCurrentRef.current.history.length - 1].path;

        path.lineTo(x, y);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        propsCurrentRef.current.history.forEach((path, index) => {
            context.strokeStyle = path.color;
            context.lineWidth = path.rangeValue;
            context.stroke(path.path);
        });
        context.strokeStyle = color;
        context.lineWidth = rangeValue;
        context.stroke(path);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    // 上一步驟  返回
    const handleUndo = () => {
        // 如果沒有畫過，就不做任何事
        // if (propsUndoRef.current.history.length === 0) return;

        // 如果你有做過 clear，那麼你再做一次 undo，就要把 undo 的陣列清空
        if (clear) {
            propsCurrentRef.current.history = [...propsUndoRef.current.history];
            // setClear(() => false);
            console.log("clear true")
            // propsCurrentRef.current.history = Array.from(propsUndoRef.current.history);
            setClear(() => false);
            // return 
        } else {
            // 如果沒有畫過，就不做任何事
            if (propsCurrentRef.current.history.length === 0) return;
            // 把最後一個畫的路徑放到 undo 的陣列中
            propsUndoRef.current.history.push(propsCurrentRef.current.history[propsCurrentRef.current.history.length - 1])
            // 把最後一個畫的路徑從 undo 的陣列中移除
            propsCurrentRef.current.history.pop();
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        propsCurrentRef.current.history.forEach((path, index) => {
            context.strokeStyle = path.color;
            context.lineWidth = path.rangeValue;
            context.stroke(path.path);
        });

        console.log(propsCurrentRef.current.history)
    };


    // 下一步驟
    const handleRedo = () => {

        // 如果有做過 clear，那麼你再做一次 redo，就要把 redo 的陣列清空
        if (clear) {
            // propsCurrentRef.current.history = [...propsRedoRef.current.history];
            // setClear(() => false);
            // console.log("clear true")
            setClear(() => false);
            // return
        } else {
            // 如果沒有做過 undo，就不做任何事
            if (propsUndoRef.current.history.length === 0) return;
            // 把最後一個 undo 的路徑放到 redo 的陣列中
            propsRedoRef.current.history.push(propsUndoRef.current.history[propsUndoRef.current.history.length - 1])
            // 把最後一個 undo 的路徑放到 current 的陣列中
            propsCurrentRef.current.history.push(propsRedoRef.current.history[propsRedoRef.current.history.length - 1])
            // 把最後一個 undo 的路徑從 redo 的陣列中移除
            propsUndoRef.current.history.pop();
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        propsCurrentRef.current.history.forEach((path, index) => {
            context.strokeStyle = path.color;
            context.lineWidth = path.rangeValue;
            context.stroke(path.path);
        });

        console.log(propsCurrentRef.current.history)
    };

    //
    const handleClear = () => {

        // 如果按下 clear，就把 現在的路徑 放到 Undo 的陣列中
        propsUndoRef.current.history = [...propsCurrentRef.current.history];
        propsCurrentRef.current.history = [];

        setClear(() => true);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    return (
        <div className="canvas-container">
            <div className="tool-list">
                <div className="list list_btn">
                    <button onClick={handleUndo}>返回</button>
                    <button onClick={handleRedo}>復原</button>
                    <button onClick={handleClear}>清除</button>
                </div>

                <div className="list">
                    <label htmlFor="color">選擇顏色</label>
                    <input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    <div>{color}</div>
                </div>

                <div className="list">
                    <label htmlFor="range">選擇粗細</label>
                    <input id="range" type="range" min="1" max="100" value={rangeValue} onChange={(e) => setRangeValue(parseInt(e.target.value))} />
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
