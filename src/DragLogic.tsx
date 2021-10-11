import EventEmitter from 'eventemitter3';
import {DragItem} from "./DragItem";

export interface Point {
    x: number;
    y: number;
}

export default class DragLogic extends EventEmitter{
    public dragItems: DragItem[] = [];

    public currentDragItem: DragItem | undefined;
}
