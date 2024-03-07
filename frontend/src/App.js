//All Work is Done by Cameron Weiss, unless stated otherwise

import './App.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';

import TestPage from './pages/TestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GaragePage from './pages/GaragePage';
import CameraPage from './pages/CameraPage';
import CatchPage from './pages/CatchPage';
import SearchPage from './pages/SearchPage';
import RelationList from './components/RelationList';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"> {/* can put an element here https://www.w3schools.com/react/react_router.asp */}
                    <Route index element={<TestPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/garage/:profile?" element={<GaragePage />} />
                    <Route path="/camera" element={<CameraPage />} />
                    <Route path="/catch" element={<CatchPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/relations" element={<RelationList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);