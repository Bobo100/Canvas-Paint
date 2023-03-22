// 嚴格清除模式
import React, { useEffect, useRef, useState } from "react";

interface Props2 {
    history: {
        path: Path2D;
        color: string;
        rangeValue: number;
        tool: string;
    }[]
}


export const CanvasTest2 = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [rangeValue, setRangeValue] = useState(1);
    const propsUndoRef = useRef<Props2>({ history: [] });
    const propsCurrentRef = useRef<Props2>({ history: [] });
    const propsRedoRef = useRef<Props2>({ history: [] });

    // 紀錄使用者的最後一個動作
    const [lastAction, setLastAction] = useState("");

    // 紀錄使用者第一次點擊的位置
    const [firstPos, setFirstPos] = useState({ x: 0, y: 0 });
    // 紀錄移動最後一個點的位置
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    // 紀錄現在的工具
    const [tool, setTool] = useState("brush");

    // console.log(lastAction)

    const startDrawing = (x: number, y: number) => {
        const path = new Path2D();
        path.moveTo(x, y);
        setIsDrawing(true);

        // 如果你有做過 undo，那麼你再做一次畫圖的動作，就要把 redo 的陣列清空
        // if (propsRedoRef.current.history.length > 0) {
        //     propsRedoRef.current.history = [];
        // }

        // 假如最後一個動作是 undo 或是 draw，那麼就要把 redo 的陣列清空 
        if (lastAction === "undo" || lastAction === "draw") {
            propsUndoRef.current.history = [];
            propsRedoRef.current.history = [];
        }

        if (tool === "brush")
            propsCurrentRef.current.history.push({ path, color, rangeValue, tool });
        setLastAction(() => "draw");
        setFirstPos({ x, y });
    };


    const draw = (x: number, y: number, mouse: number) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);

        console.log(mouse)

        if (tool === "rect" && mouse === 1) { // 畫矩形
            // const path = propsCurrentRef.current.history[propsCurrentRef.current.history.length - 1].path;
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = rangeValue;
            context.rect(firstPos.x, firstPos.y, x - firstPos.x, y - firstPos.y);            
            context.stroke();
            setLastPos({ x, y });
        }
        else if (tool === "brush") {
            const path = propsCurrentRef.current.history[propsCurrentRef.current.history.length - 1].path;
            // 移動到最後一個點
            path.lineTo(x, y);
            context.strokeStyle = color;
            context.lineWidth = rangeValue;
            context.stroke(path);
            context.lineCap = "round";
        }
        // 把之前的路徑畫出來
        propsCurrentRef.current.history.forEach((path, index) => {

            context.strokeStyle = path.color;
            context.lineWidth = path.rangeValue;
            context.stroke(path.path);

        });

        setLastAction(() => "draw");
    };


    const handleMouseUp = () => {
        if (tool === "rect") {
            const path = new Path2D();
            path.rect(firstPos.x, firstPos.y, lastPos.x - firstPos.x, lastPos.y - firstPos.y);
            propsCurrentRef.current.history.push({ path, color, rangeValue, tool });
        }

        setIsDrawing(false);
    };

    // 上一步驟  返回
    const handleUndo = () => {

        if (lastAction === "clear") {
            // 如果最後一個動作是 clear，就把 undo的陣列放到 current 的陣列中
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext("2d");
            if (!context) return;

            propsCurrentRef.current.history = propsUndoRef.current.history;
            propsUndoRef.current.history = [];

            context.clearRect(0, 0, canvas.width, canvas.height);
            propsCurrentRef.current.history.forEach((path, index) => {
                context.strokeStyle = path.color;
                context.lineWidth = path.rangeValue;
                context.stroke(path.path);
            });

        }
        // 如果最後一個動作不是 clear，且 current 的陣列長度為 0，就不做任何事
        else if (lastAction !== "clear") {
            if (propsCurrentRef.current.history.length === 0) return;
            // 把最後一個畫的路徑放到 undo 的陣列中
            propsUndoRef.current.history.push(propsCurrentRef.current.history[propsCurrentRef.current.history.length - 1])
            // 把最後一個畫的路徑從 undo 的陣列中移除
            propsCurrentRef.current.history.pop();

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
        }
        setLastAction(() => "undo");

    };


    // 下一步驟
    // 如果有做過 undo，那麼你才能做 redo
    const handleRedo = () => {
        // 如果最後一個動作是 clear，就不做任何事
        if (lastAction === "clear") {
            return;
        }
        else if (lastAction === "draw") {
            propsUndoRef.current.history = [];
        }
        // 如果沒有 undo，就不做任何事
        if (propsUndoRef.current.history.length === 0) return;
        // 把最後一個 undo 的路徑放到 redo 的陣列中
        propsRedoRef.current.history.push(propsUndoRef.current.history[propsUndoRef.current.history.length - 1])
        // 把最後一個 undo 的路徑放到 current 的陣列中
        propsCurrentRef.current.history.push(propsUndoRef.current.history[propsUndoRef.current.history.length - 1])
        // 把最後一個 undo 的路徑從 redo 的陣列中移除
        propsUndoRef.current.history.pop();

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
        setLastAction(() => "redo");
    };

    const handleClear = () => {

        // 如果按下 clear，就current 的陣列放到 undo 的陣列中
        propsUndoRef.current.history = [...propsCurrentRef.current.history];
        // 把 current 的陣列清空
        propsCurrentRef.current.history = [];
        propsRedoRef.current.history = [];

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        setLastAction(() => "clear");
    }


    return (
        <div className="canvas-container">
            <div className="tool-list">

                <div className="list">
                    確認狀態：{lastAction}
                </div>

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
                    <input id="range" type="range" min="1" max="8" value={rangeValue} onChange={(e) => setRangeValue(parseInt(e.target.value))} />
                    <div>{rangeValue}</div>
                </div>

                <div className="list">
                    {/* radio 選擇一個是筆刷 一個是畫框框 */}
                    <label htmlFor="brush">筆刷</label>
                    <input id="brush" type="radio" name="tool" value="brush" checked={tool === "brush"} onChange={(e) => setTool(e.target.value)} />
                    <label htmlFor="rect">畫框框</label>
                    <input id="rect" type="radio" name="tool" value="rect" checked={tool === "rect"} onChange={(e) => setTool(e.target.value)} />
                </div>
            </div>

            <div className="flex">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={(e) => startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                    onMouseMove={(e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY, e.nativeEvent.buttons)}
                    onMouseUp={handleMouseUp}
                />


                <div className="tool-sidelist">
                    <button onClick={handleUndo}>Undo</button>
                </div>
            </div>
        </div>
    );
};
