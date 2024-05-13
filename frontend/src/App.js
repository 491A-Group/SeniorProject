//All Work is Done by Cameron Weiss, unless stated otherwise

import './App.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TestPage from './pages/TestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GaragePage from './pages/GaragePage';
import CameraPage from './pages/CameraPage';
import CatchPage from './pages/CatchPage';
import SearchPage from './pages/SearchPage';
import RelationList from './components/RelationList';
import FeatureRequest from './pages/FeatureRequest';
import DailyEvent from './pages/DailyEvent';
import SettingsPage from './pages/SettingsPage';
import SettingsDebugPage from './pages/SettingsDebugPage';
import ProfilePicSwap from './pages/SettingsPFP';
import ResetUserInfo from './pages/SettingsResetUserInfo';
import NoZoom from './components/NoZoom';


//the main return of the app
export default function App() {

    //build the app visually
    return (
        <>
        <NoZoom />
        <BrowserRouter>
            <Routes>
                {/*Create paths for all the pages on the site */}
                <Route path="/"> {/* can put an element here https://www.w3schools.com/react/react_router.asp */}
                    <Route index element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/garage/:profile?" element={<GaragePage />} />
                    <Route path="/camera" element={<CameraPage />} />
                    <Route path="/catch" element={<CatchPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/relations" element={<RelationList />} />
                    <Route path="/bug-report" element={<FeatureRequest />} />
                    <Route path="/daily" element={<DailyEvent />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/debug" element={<SettingsDebugPage />} />
                    <Route path="/pfp" element={<ProfilePicSwap />} />
                    <Route path="/reset-user-info" element={<ResetUserInfo />} />
                    
                </Route>
            </Routes>
        </BrowserRouter>
    </>
    );
}


//this is what renders EVERYTHING
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);