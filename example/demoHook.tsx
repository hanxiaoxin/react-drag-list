import React, {useEffect, useState, useRef} from 'react';
import {DragList} from "../index";
import img1 from './assets/1.png';
import img2 from './assets/1.png';
import img3 from './assets/1.png';

export default function DemoHook() {
    const [items, setItems] = useState([{
        id: 1,
        name: 'a',
        img: img1
    },
        {
            id: 2,
            name: 'b',
            img: img2
        },
        {
            id: 3,
            name: 'c',
            img: img3
        },
    ])

    const itemRender = (item: any) => {
        return <div className='demo'>
            <span>{item.name}</span>
            <img className='demo-img' key={item.id} src={item.img} alt=""/>
        </div>;
    }

    return (
        <DragList items={items} itemRender={itemRender}></DragList>
    );
}
