import React, { useState, useEffect } from 'react';
import './LoginPage.css';
  

export default function LoginPage({ changePage }) {

  //When isLogIn is false, assume the user wants to create an account
  const [isLogIn, setIsLogIn] = useState(true);

  //THIS FUNCTION FORCES THE PAGE TO NOT SCROLL AT ALL
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
          document.body.style.overflow = "scroll"
      };
  }, []);
  
    
    //These states have the strings of user input in the forms. 
    //The Login and Register portions share these states so switching between them doesn't clear fields
    const [input_displayname, setDisplayname] = useState('');
    const [input_email, setEmail] = useState('');
    const [input_password, setPassword] = useState('');
    //Handlers for the states - updates changes when users type
    const handleDisplaynameChange = (event) => {setDisplayname(event.target.value)}
    const handleEmailChange = (event) => {setEmail(event.target.value)}
    const handlePasswordChange = (event) => {setPassword(event.target.value)}

    //BRIAN: helped write this function to log in
    // currently just works with cookies and does no re-routing logic
    const handleSubmitLogin = (event) => {
        let login_form = new FormData()
        login_form.append("email", input_email)
        login_form.append("password", input_password)

        //console.log(input_email, input_password)
        fetch(window.location.origin + "/login", {
            method: 'POST',
            body: login_form
        })
        .then(response => {
            if (response.ok) {
                console.log("login success")
            } else {
                console.log("login error")
            }
        })
    }

    //BRIAN: helped write this function to sign up
    // currently just works with cookies and does no re-routing logic
    const handleSubmitRegister = (event) => {
        let signup_form = new FormData()
        signup_form.append("displayname", input_displayname)
        signup_form.append("email", input_email)
        signup_form.append("password", input_password)
        
        //console.log(input_displayname, input_email, input_password)
        fetch(window.location.origin + "/register", {
            method: 'POST',
            body: signup_form
        })
        .then (response => {
            if (response.ok) {
                console.log("signup response received ", response)
            } else {
                console.log("signup error")
            }
        })
    }


    return (
        <div className="container">
            <h1>Welcome to SportsCar Spotter</h1>
            { isLogIn ? (
                <>
                    <h2>Log In</h2>
                    <input type="email" value={input_email} onChange={handleEmailChange} placeholder="Email" />
                    <br />
                    <input type="password" value={input_password} onChange={handlePasswordChange} placeholder="Password" />
                    <br />
                    <button className="btn">Forgot Password?</button>
                    <br />
                    <button className="btn" onClick={handleSubmitLogin}>Log In</button>
                    <p>
                        Don't have an account? 
                        <button className="btn" onClick={() => setIsLogIn(false)}>Register</button>
                    </p>
                </>
            ) : (
                <>
                    <h2>Register</h2>
                    <input type="text" value={input_displayname} onChange={handleDisplaynameChange} placeholder="Displayname"/>
                    <br />
                    <input type="email" value={input_email} onChange={handleEmailChange} placeholder="Email" />
                    <br />
                    <input type="password" value={input_password} onChange={handlePasswordChange} placeholder="Password" />
                    <br />
                    <button className="btn" onClick={handleSubmitRegister}>Register</button>
                    <p>
                        Already have an account? 
                        <button className="btn" onClick={() => setIsLogIn(true)}>Log In</button>
                    </p>
                </>
            )}
            <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
        </div>
    );
};
