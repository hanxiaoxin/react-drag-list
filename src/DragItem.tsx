import React from 'react';
import DragLogic, {Point} from "./DragLogic";
import ReactDOM from "react-dom";

export interface DragItemProps {
    logic: DragLogic,
    id: number;
}

export interface DragItemState {
    id: number;
    isDragging: boolean;
}

export class DragItem extends React.Component<DragItemProps, DragItemState>{
    public offset: Point = {x: 0, y: 0};
    public dragStart: Point = {x: 0, y: 0};
    public rect = {width: 0, height: 0,left: 0, top: 0};
    public area = 0;

    public style: React.CSSProperties = {
        position: 'relative',
        boxSizing: 'border-box'
    };

    public isDragging = false;

    static count = 0;

    constructor(props: DragItemProps) {
        super(props);
        this.state = {
            id: DragItem.count++,
            isDragging: false
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    componentDidMount() {
        const element = ReactDOM.findDOMNode(this) as HTMLElement;
        if(element) {
            const rect = element.getBoundingClientRect();
            this.offset.x = rect.x ;
            this.offset.y = rect.y;
            this.rect.width = rect.width;
            this.rect.height = rect.height;
            this.rect.left = rect.left;
            this.rect.top = rect.top;
        }
        this.props.logic.dragItems.push(this);
        this.props.logic.on('draggingUp', () => {
            this.setState({
                isDragging: false
            });
        })
    }

    componentDidUpdate(prevProps: Readonly<DragItemProps>, prevState: Readonly<DragItemState>, snapshot?: any) {
        const element = ReactDOM.findDOMNode(this) as HTMLElement;
        if(element) {
            const rect = element.getBoundingClientRect();
            this.offset.x = rect.x ;
            this.offset.y = rect.y;
            this.rect.width = rect.width;
            this.rect.height = rect.height;
            this.rect.left = rect.left;
            this.rect.top = rect.top;
        }
    }

    handleMouseDown(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        this.dragStart.x = e.clientX;
        this.dragStart.y = e.clientY;

        this.props.logic.emit('mouseDown', this);
        this.isDragging = true;

        this.setState({
            isDragging: true
        })
    }

    handleMouseOver(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
    }

    render() {
        const classes = ['nankle-rdl-item'];
        if(this.state.isDragging) {
            classes.push('nankle-rdl-is-dragging');
        }
        const classnames = classes.join(' ');
        return <div className={classnames} onMouseDown={this.handleMouseDown} onMouseOver={this.handleMouseOver} style={this.style}>
            {this.props.children}
        </div>
    }
}

