import React from 'react';
import ReactDOM from 'react-dom';
import {DragList} from '../index';
import './index.scss';
import { Button } from 'antd';
import 'antd/dist/antd.css';

const items = [
    {id: 1, name: 'a'},
    {id: 2, name: 'b'},
    {id: 3, name: 'c'},
    {id: 4, name: 'd'},
];

const itemRender = (item: any) => {
    return <div className='ex-item'>
        <Button>{item.name}</Button>
    </div>;
}

ReactDOM.render(
    <DragList itemRender={itemRender} items={items}/>,
    document.getElementById('app')
);
