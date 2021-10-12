import React, {CSSProperties, ReactElement} from 'react';
import {DragItem} from "./DragItem";
import {DraggingItem} from "./Dragging";
import DragLogic, {Point} from "./DragLogic";
import ReactDOM from "react-dom";

export interface DragItemModel {
    id: number;
}

export interface DragListProps {
    mode: 'vertical' | 'horizontal';
    classNames: string[];
    itemRenderer(item: DragItemModel): React.ReactElement;
    items: DragItemModel[],
    children: any[];
    onChange?: (items: DragItemModel[]) => void;
}

export interface DragListState {
    dragItemId: number;
    styles: CSSProperties | undefined;
    items: DragItemModel[],
}


export class DragList extends React.Component<DragListProps, DragListState>{
    static defaultProps = {
        mode: 'vertical',
        classNames: [],
        itemRender: (item: DragItemModel) => {},
        items: [],
        onChange: (items: DragItemModel[]) => {}
    };

    public offset: Point = {
        x: 0,
        y: 0
    }

    public logic: DragLogic;

    constructor(props: DragListProps) {
        super(props);
        this.logic = new DragLogic();
        this.calculateOverflow = this.calculateOverflow.bind(this);
        this.handleDraggingUp = this.handleDraggingUp.bind(this);
        this.handleDraggingMove = this.handleDraggingMove.bind(this);
        this.logic.on('draggingMove', this.handleDraggingMove);
        this.logic.on('draggingUp', this.handleDraggingUp);
        this.state = {
            styles: {
                'display': 'inline-flex',
                'flexDirection': props.mode === 'vertical' ? 'column' : 'row'
            },
            dragItemId: -1,
            items: [...props.items]
        };
    }

    componentDidUpdate(prevProps: Readonly<DragListProps>, prevState: Readonly<DragListState>, snapshot?: any) {
        if(prevProps.items !== this.props.items) {
           this.setState({
               items: this.props.items
           });
        }
    }

    componentDidMount() {
        const currentDOM = ReactDOM.findDOMNode(this) as HTMLElement;
        if(currentDOM) {
            this.offset.x = currentDOM.offsetLeft;
            this.offset.y = currentDOM.offsetTop;
        }
    }

    handleDraggingMove(rect: DOMRect) {
        this.handleDraggingUp(rect, false);
    }

    handleDraggingUp(rect: DOMRect, emit: boolean = true) {
        const current = this.logic.currentDragItem;
        if(this.logic.dragItems.length > 1) {
            const id = this.calculateOverflow(rect);

            if(id && current) {
                const currentIndex = this.state.items.findIndex(item => item.id === current.props.id);
                const replaceIndex = this.state.items.findIndex(item => item.id === id);
                // console.log(currentIndex, replaceIndex, this.logic.dragItems)
                const items = [...this.state.items];
                const source = this.state.items[currentIndex];
                items.splice(currentIndex, 1);
                items.splice(replaceIndex, 0, source);
                this.setState({
                    items: items
                });
                if(this.props.onChange && emit) {
                    this.props.onChange(items);
                }
            }
        }
    }

    /**
     * 计算交叉
     */
    calculateOverflow(rect: DOMRect) {
        const dragItems = this.logic.dragItems;

        const rectW = rect.width;
        const rectH = rect.height;
        const rectLeft = rect.left;
        const rectTop = rect.top;

        // console.log(rect);

        for(const drag of dragItems) {
            const W = rectW + rectW - (Math.max((rectLeft + rectW), (drag.rect.left + rectW)) - Math.min(rectLeft, drag.rect.left));
            const H = rectH + rectH - (Math.max((rectTop + rectH), (drag.rect.top + rectH)) - Math.min(rectTop, drag.rect.top));
            drag.area = W * H;
            // console.log(rect, drag,  drag.area);
        }

        let max = 0,id = undefined;
        for(let i = 0; i<dragItems.length; i++) {
            if(dragItems[i].area > max) {
                max = dragItems[i].area;
                id = dragItems[i].props.id;
            }
        }

        return id;
    }

    render() {
        const renderItems = this.state.items.map((item: DragItemModel) => {
            return <DragItem logic={this.logic} id={item.id} key={item.id}>
                {this.props.itemRenderer(item)}
            </DragItem>;
        })


        return <div className='rdl-container' style={this.state.styles}>
            {renderItems}
            <DraggingItem logic={this.logic}/>
        </div>;
    }
}
