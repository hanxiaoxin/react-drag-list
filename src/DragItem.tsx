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
    public dragStart: Point = {x: 0, y: 0};
    public rect = {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        offsetLeft: 0,
        offsetTop: 0
    };

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
        this.calculatePosition = this.calculatePosition.bind(this);
    }

    componentDidMount() {
        this.calculatePosition();
        this.props.logic.dragItems.push(this);
        this.props.logic.on('draggingUp', () => {
            this.setState({
                isDragging: false
            });
        })
    }

    componentDidUpdate(prevProps: Readonly<DragItemProps>, prevState: Readonly<DragItemState>, snapshot?: any) {
        this.calculatePosition();
    }

    // 计算item相对于parent位置
    calculatePosition() {
        const element = ReactDOM.findDOMNode(this) as HTMLElement;
        if(element) {
            const itemRect = element.getBoundingClientRect();
            const parent = element.parentElement;

            if(parent) {
                const parentRect = parent.getBoundingClientRect();
                this.rect.width = itemRect.width;
                this.rect.height = itemRect.height;
                this.rect.left = itemRect.left;
                this.rect.top = itemRect.top;
                this.rect.offsetLeft = itemRect.left - parentRect.left;
                this.rect.offsetTop = itemRect.top - parentRect.top;
                // console.log(itemRect, parentRect, this.rect)
            }
        }
    }

    handleMouseDown(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        this.dragStart.x = e.clientX;
        this.dragStart.y = e.clientY;
        // console.log(this);
        this.props.logic.handleMouseDown(this);
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

