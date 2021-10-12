import EventEmitter from 'eventemitter3';
import {DragItem} from "./DragItem";

export interface Point {
    x: number;
    y: number;
}

export default class DragLogic extends EventEmitter{
    public dragItems: DragItem[] = [];

    public currentDragItem: DragItem | undefined = undefined;

    constructor() {
        super();
        this.init();
    }

    init() {
        window.document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(dragItem: DragItem) {
        this.currentDragItem = dragItem;
        this.emit('mouseDown', dragItem);
    }

    handleMouseUp(e: MouseEvent) {
        this.currentDragItem = undefined;
        this.emit('mouseUp', e);
    }

    handleMouseMove(e: MouseEvent) {
        if(this.currentDragItem) {
            this.emit('mouseMove', e);
        }
    }

    destroy() {
        window.document.removeEventListener('mouseup', this.handleMouseUp);
        window.document.removeEventListener('mousemove', this.handleMouseMove);
    }
}
