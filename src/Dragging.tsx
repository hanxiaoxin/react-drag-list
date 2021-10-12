import React from "react";
import DragLogic, {Point} from "./DragLogic";
import {DragItem} from "./DragItem";
import ReactDOM from "react-dom";

export interface DraggingProps {
    logic: DragLogic
}

export interface DraggingState {
    current: React.ReactNode;
}

export class DraggingItem extends React.Component<DraggingProps, DraggingState> {
    public style: React.CSSProperties = {
        position: 'absolute'
    };

    dragPosition =  {
        offsetLeft: 0,
        offsetTop: 0
    };

    public rememberDrag = {
        offset: {
            x: 0,
            y: 0
        },
        dragStart: {
            x: 0,
            y: 0
        }
    };

    constructor(props: DraggingProps) {
        super(props);
        this.state = {
          current: null,
        };
        this.handleDown = this.handleDown.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleMove = this.handleMove.bind(this);

        this.props.logic.on('mouseDown', (e) => this.handleDown(e));
        this.props.logic.on('mouseUp', (e) => this.handleUp(e));
        this.props.logic.on('mouseMove', (e) => this.handleMove(e));
    }

    componentDidMount() {
        // console.log(this);
    }

    /**
     * 元素准备拖拽
     * @param current
     */
    handleDown(current: DragItem) {
        this.setState({
            current: current.props.children
        });

        this.dragPosition.offsetLeft = current.rect.offsetLeft;
        this.dragPosition.offsetTop = current.rect.offsetTop;

        this.rememberDrag.dragStart.x = current.dragStart.x;
        this.rememberDrag.dragStart.y = current.dragStart.y;

        this.setPosition({
            x: this.dragPosition.offsetLeft,
            y: this.dragPosition.offsetTop
        });
    }

    /**
     * 拖拽结束，进入处理
     * @param e
     */
    handleUp(e: MouseEvent) {
        const dom = ReactDOM.findDOMNode(this) as Element;
        const domRect = dom.getBoundingClientRect();
        this.props.logic.emit('draggingUp', domRect);
        this.setState({
            current: null
        });
    }

    handleMove(e: MouseEvent) {
        const target = e.target as HTMLElement;
        // 拖拽的时候item位置会重新计算，所以需要使用之前的位置
        const newPosition = {
            x: this.dragPosition.offsetLeft + (e.clientX - this.rememberDrag.dragStart.x)    ,
            y: this.dragPosition.offsetTop + (e.clientY - this.rememberDrag.dragStart.y)
        };
        // console.log(newPosition)
        this.setPosition(newPosition);
        const domRect = target.getBoundingClientRect();
        this.props.logic.emit('draggingMove', domRect);
    }

    setPosition(position: Point) {
        // console.log(position)
        const dom = ReactDOM.findDOMNode(this) as Element;

        if(dom instanceof HTMLElement) {
            dom.style.left = position.x + 'px';
            dom.style.top = position.y + 'px';
        }
    }

    render() {
        return <div className='rdl-dragging' style={this.style}>
            {this.state.current}
        </div>
    }
}
