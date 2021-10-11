import React from 'react';
import ReactDOM from 'react-dom';
import {DragList} from '../index';
import './index.scss';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import DemoHook from "./demoHook";

ReactDOM.render(
    <DemoHook/>,
    document.getElementById('app')
);
