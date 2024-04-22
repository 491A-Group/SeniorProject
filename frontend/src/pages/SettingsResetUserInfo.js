import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsResetUserInfo = () => {
    const navigate = useNavigate();

    const [changeDisplayname_displayname, setChangeDisplayname_displayname] = useState('');
    const [changeDisplayname_password, setChangeDisplayname_password] = useState('');
    const [displaynameStatus, setDisplaynameStatus] = useState('');
    const handleChangeDisplayname_displaynameChange = (e) => {
        setChangeDisplayname_displayname(e.target.value)
    }
    const handleChangeDisplayname_passwordChange = (e) => {
        setChangeDisplayname_password(e.target.value)
    }
    const submitDisplaynameChange = (e) => {
        e.preventDefault();
        // PLEASE PUT A LOADING GIF SOMEWHERE WHEN THIS FUNCTION IS WORKING. mess with displaynamestatus however u want
        setDisplaynameStatus('working...')

        fetch(window.location.origin + '/settings/displayname', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                displayname: changeDisplayname_displayname,
                password: changeDisplayname_password
            })
        }).then(async (response) => {
            const code = response.status;
            switch(code) {
                case 200:
                    setDisplaynameStatus('success')
                    break;
                case 409:
                    setDisplaynameStatus('taken already')
                    break;
                case 401:
                    setDisplaynameStatus('password incorrect')
                    break;
                case 422:
                    const t = await response.text()
                    setDisplaynameStatus(t)
                    break;
                case 500:
                    setDisplaynameStatus('server error')
                    break;
            }
        })
    }





    const [changePassword_old, setChangePassword_old] = useState('');
    const [changePassword_new, setChangePassword_new] = useState('');
    const [changePassword_confirm, setChangePassword_confirm] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('');
    const handleChangePassword_old = (e) => {
        setChangePassword_old(e.target.value)
    }
    const handleChangePassword_new = (e) => {
        setChangePassword_new(e.target.value)
    }
    const handleChangePassword_confirm = (e) => {
        setChangePassword_confirm(e.target.value)
    }
    const submitPasswordChange = (e) => {
        e.preventDefault();
        
        if(changePassword_new != changePassword_confirm) {
            setPasswordStatus('new password does not match confirmation')
            return
        }
        
        // PLEASE PUT A LOADING GIF SOMEWHERE WHEN THIS FUNCTION IS WORKING. mess with displaynamestatus however u want
        setPasswordStatus('working...')

        fetch(window.location.origin + '/settings/password', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                new_password: changePassword_new,
                old_password: changePassword_old
            })
        }).then(async (response) => {
            const code = response.status;
            switch(code) {
                case 200:
                    setPasswordStatus('success')
                    break;
                case 401:
                    setPasswordStatus('password incorrect')
                    break;
                case 422:
                    const t = await response.text()
                    setPasswordStatus(t)
                    break;
                case 500:
                    setPasswordStatus('server error')
                    break;
            }
        })
    }





    return <>
        <BackButton enableBackButton={true} />
        <div className='container'>
        <h1 classname = "h1">Reset DisplayName/Password</h1>
        </div>

        <form onSubmit={submitDisplaynameChange}>
            <input 
                type="text"
                value={changeDisplayname_displayname}
                onChange={handleChangeDisplayname_displaynameChange}
                placeholder="Desired Displayname"
            />
            <input 
                type="text"
                value={changeDisplayname_password}
                onChange={handleChangeDisplayname_passwordChange}
                placeholder="Password"
            />
            
            <p>
                <button type="submit">Change Displayname</button>
                displayname status: {displaynameStatus}
            </p>
        </form>



        <form onSubmit={submitPasswordChange}>
            <input 
                type="text"
                value={changePassword_old}
                onChange={handleChangePassword_old}
                placeholder="old password"
            />
            <input 
                type="text"
                value={changePassword_new}
                onChange={handleChangePassword_new}
                placeholder="new password"
            />
            <input 
                type="text"
                value={changePassword_confirm}
                onChange={handleChangePassword_confirm}
                placeholder="confirm new"
            />

            <p>
                <button type="submit">Change Password</button>
                password status: {passwordStatus}
            </p>
        </form>

    </>
}    

export default SettingsResetUserInfo;