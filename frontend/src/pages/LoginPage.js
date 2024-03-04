import React, { useState, useEffect } from 'react';
import './LoginPage.css';
  

export default function LoginPage({ changePage }) {
  
    //Le Duong
    //When isLogIn is false, assume the user wants to create an account
    const [isLogIn, setIsLogIn] = useState(true);
  
    //Le Duong 
    //THIS FUNCTION FORCES THE PAGE TO NOT SCROLL AT ALL
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
          document.body.style.overflow = "scroll"
      };
    }, []);
  
    //Le Duong
    //These states have the strings of user input in the forms. 
    //The Login and Register portions share these states so switching between them doesn't clear fields
    const [input_displayname, setDisplayname] = useState('');
    const [input_email, setEmail] = useState('');
    const [input_password, setPassword] = useState('');
    const [check_password, setCheckPassword] = useState(true);

    //RL: This is new, error messages for email verification and forgotten password.
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    
    //Le Duong: state for pw pop up note for pw suggestions
    const [passwordNoteVisible, setPasswordNoteVisible] = useState('');
  
    //Le Duong: changes state to show password note when user clicks on pw field
    const handlePasswordClick = () => {
      setPasswordNoteVisible(true);
    };
  
    //RL: This was written to handle both switching between Login/Register
    //pages AND clearing error messages (invalid email message does not
    //persist rendering on Login page once switched back and forth)
    const handlePageSwitch = (status) => {
      setIsLogIn(status);
      setErrorMessage('');
      setPasswordMessage('');
      setPasswordNoteVisible('');
    }
  

    //Handlers for the states - updates changes when users type
    const handleDisplaynameChange = (event) => {setDisplayname(event.target.value)}
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        validateEmail(event.target.value);
    }
  
    const handlePasswordChange = (event) => {setPassword(event.target.value)}

    const handlePasswordCheck = (event) => {
      if (input_password !== check_password) {
        setCheckPassword(true);
      } else {
        setCheckPassword(false);
      }
    }
  
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

    const handleForgottenPassword = (event) => {
        event.preventDefault();

        setPasswordMessage("Yo that's crazy dawg, why'd you forget it ¯\\_(ツ)_/¯");
        return;
    }

    //Now this is a real doozy, this function uses a regular expression to ensure that
    //email input follows a certain combination. To successfully pass validation an email must be the following combination:
    // (chars) + (@) + (chars) + (.) + (chars)
    //Not perfect but it's what I managed to figure out. 
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    
  //Le Duong
  //creates HTML container that swaps between login page and registration page by calling setIsLogIn function
  return (
      <div className="loginpage">
        <div className="container">
            <h1 className="h1">Welcome to SportsCar Spotter 🏎️ 💨</h1>
            { isLogIn ? (
                <>
                    <h2 className="h2">Log In</h2>
                    <input type="email" value={input_email} onChange={handleEmailChange} placeholder="Email" />
                    <br />
                    <input type="password" value={input_password} onChange={handlePasswordChange} placeholder="Password" />
                    <br />
                    <button className="btn" onClick={handleForgottenPassword}>Forgot Password?</button>
                    <br />
                    {passwordMessage && <div style = {{color: 'red'}}>{passwordMessage}</div>}
                    <br />
                    <button className="btn" onClick={handleSubmitLogin}>Log In</button>
                    <p> 
                        <button className="btn" onClick={() => handlePageSwitch(false)}>Register</button>
                    </p>
                </>
            ) : (
                <>
                    <h2 className="h2">Register</h2>
                    <input type="text" value={input_displayname} onChange={handleDisplaynameChange} placeholder="Displayname"/>
                    <br />
                    <input type="email" value={input_email} onChange={handleEmailChange} placeholder="Email" />
                    <br />
                    {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
                    <input
                      type="password"
                      value={input_password}
                      onChange={handlePasswordChange}
                      onClick={handlePasswordClick}
                      placeholder="Password"
                    />
                    <br />
                    <input
                      type="password"
                      value={check_password}
                      onClick={handlePasswordCheck}
                      placeholder="Confirm Password"
                    /> 
                    <br />
                    <p className="p" id = "pwderror" style={{ display: passwordNoteVisible ? 'block' : 'none'}}>
                      Passwords do not match. Please try again. <br />
                    </p>
                    <p className="p" id = "pwdnote" style={{ display: passwordNoteVisible ? 'block' : 'none'}}>
                      Password should be: <br />
                      - 8 to 16 characters <br />
                      - use a variety of characters (lowercase, uppercase, numbers, and special characters)  <br />
                      - unique and distinct <br />
                    </p>
                    <br />
                    <button className="btn" onClick={handleSubmitRegister}>Register</button>
                    <p className="p">
                        Already have an account? 
                        <button className="btn" id = "loginbtn" onClick={() => handlePageSwitch(true)}>Log In</button>
                    </p>
                </>
            )}
            <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
        </div>
      </div>
    );
};
