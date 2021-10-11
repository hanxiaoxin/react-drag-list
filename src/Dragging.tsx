import React from "react";
import DragLogic, {Point} from "./DragLogic";
import {DragItem} from "./DragItem";
import ReactDOM from "react-dom";
import _ from "lodash";

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

    public current: DragItem| undefined;

    public remeberCurrent: DragItem| undefined;

    constructor(props: DraggingProps) {
        super(props);
        this.state = {
          current: null,
        };
        this.handleDown = this.handleDown.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleMove = this.handleMove.bind(this);

        this.props.logic.on('mouseDown', this.handleDown);
        window.document.addEventListener('mouseup', this.handleUp);
        window.document.addEventListener('mousemove', this.handleMove);
    }

    componentDidMount() {
        // console.log(this);
    }

    handleDown(current: DragItem) {
        this.setState({
            current: current.props.children
        });
        this.current = current;
        this.remeberCurrent = _.cloneDeep(current);
        this.props.logic.currentDragItem = current;
        this.setPosition(current.offset);
    }

    handleUp(e: MouseEvent) {
       if(this.current) {
           const dom = ReactDOM.findDOMNode(this) as Element;
           const domRect = dom.getBoundingClientRect();
           this.props.logic.emit('draggingUp', domRect);
           this.current.isDragging = false;
           this.setState({
               current: null
           });
       }
    }

    handleMove(e: MouseEvent) {
        if(this.current &&this.remeberCurrent&& this.current.isDragging) {
           const target = e.target as HTMLElement;
           const newPosition = {
                x: this.remeberCurrent.offset.x + (e.clientX - this.remeberCurrent.dragStart.x),
                y: this.remeberCurrent.offset.y + (e.clientY - this.remeberCurrent.dragStart.y)
           };
           this.setPosition(newPosition);
           const domRect = target.getBoundingClientRect();
           this.props.logic.emit('draggingMove', domRect);
        }
    }

    setPosition(position: Point) {
        // console.log(position)
        const dom = ReactDOM.findDOMNode(this) as Element;

        if(dom instanceof HTMLElement) {
            dom.style.left = position.x + 'px';
            dom.style.top = position.y + 'px';
        }
    }

    componentWillUnmount() {
        window.document.removeEventListener('mouseup', this.handleUp);
    }

    render() {
        return <div className='rdl-dragging' style={this.style}>
            {this.state.current}
        </div>
    }
}
