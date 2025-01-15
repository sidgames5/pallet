import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import NoPage from './pages/NoPage';
import LayoutExplorer from './pages/explorer/Layout';
import Explorer from './pages/explorer/Explorer';
import Info from './pages/explorer/Info';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="explorer" element={<LayoutExplorer />}>
                    <Route index element={<Explorer />} />
                    <Route path="item" element={<NoPage />}/>
                    <Route path="buulding" element={<NoPage />}/>
                    <Route path="area" element={<NoPage />}/>
                    <Route path="shelf" element={<NoPage />}/>
                    <Route path=":objectType/:objectId" element={<Info />} />
                </Route>
            </Route>
            <Route path="*" element={<NoPage />} />
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
