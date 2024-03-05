import React, { useState, useEffect } from 'react';
import './LoginPage.css';
  

export default function LoginPage({ changePage }) {
  
    //Le Duong
    //When isLogIn is false, assume the user wants to create an account
    const [isLogIn, setIsLogIn] = useState(true);
    const [successfulLogIn, setSuccessfulLogIn] = useState(false);
  
    //Le Duong 
    //THIS FUNCTION FORCES THE PAGE TO NOT SCROLL AT ALL
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
          document.body.style.overflow = "scroll"
      };
    }, []);


    //RL: This effect is used to give a second-long pause,
    //then redirect user to Home page once they have successfully logged in.
    useEffect(() => {
        if (successfulLogIn) {
            const timeout = setTimeout(() => {
                changePage("Home");
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [successfulLogIn]); //dependency array, used to prevent re-running effect after every render
  
    //Le Duong
    //These states have the strings of user input in the forms. 
    //The Login and Register portions share these states so switching between them doesn't clear fields
    const [input_displayname, setDisplayname] = useState('');
    const [input_email, setEmail] = useState('');
    const [input_password, setPassword] = useState('');
    const [check_password, setCheckPassword] = useState('');

    //RL: This is new, error messages for email verification and forgotten password.
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passErrorMessage, setPassErrorMessage] = useState('');
    const [passwordNotMatchError, setPasswordNotMatchError] = useState('');
    
    
    //Le Duong: state for pw pop up note for pw suggestions
    const [passwordNoteVisible, setPasswordNoteVisible] = useState(false);
  
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
      setPasswordNoteVisible(false);
      setDisplayNameErrorMessage('');
      setEmailErrorMessage('');
      setPasswordNotMatchError('');
    }
  

    //Handlers for the states - updates changes when users type
    const handleDisplaynameChange = (event) => {setDisplayname(event.target.value)}
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        validateEmail(event.target.value);
    }
  
    const handlePasswordChange = (event) => {setPassword(event.target.value)}

    const handleCheckPasswordChange = (event) => {setCheckPassword(event.target.value)}

    
  
    //BRIAN: helped write this function to log in
    // currently just works with cookies and does no re-routing logic
    const handleSubmitLogin = (event) => {

        //RL: This new chunk is for validating that the email and password
        //fields are valid before continuing the rest of handleSubmitLogin.
        setEmailErrorMessage('');
        setPassErrorMessage('');

        let hasError = false;

        if (!validateEmail(input_email)) {
            setEmailErrorMessage("Invalid email format.");
            hasError = true;
        }

        if (!validatePassword(input_password)) {
            setPassErrorMessage("Password field cannot be blank.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setEmailErrorMessage('');
        setPassErrorMessage('');

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
                setSuccessfulLogIn(true); //new; needed for redirect to homepage after successful login.
                console.log("login success")
            } else {
                console.log("login error")
            }
        })
    }

    //BRIAN: helped write this function to sign up
    // currently just works with cookies and does no re-routing logic
    const handleSubmitRegister = (event) => {
        setPasswordNotMatchError('');
        setEmailErrorMessage('');
        setPassErrorMessage('');
        setDisplayNameErrorMessage('');
        setPasswordNoteVisible(false);
        let hasError = false;

        if (!validateEmail(input_email)) {
            setEmailErrorMessage("Invalid email format.");
            hasError = true;
        }

        if (!validatePassword(input_password)) {
            setPassErrorMessage("Password field cannot be blank.");
            hasError = true;
        }

        if(!validateDisplayName(input_displayname)) {
            setDisplayNameErrorMessage("Display Name cannot be blank.")
            hasError = true;
        }

        if (!handlePasswordCheck(input_password, check_password)) {
            setPasswordNotMatchError("Passwords do not match.")
            setPasswordNoteVisible(!passwordNoteVisible);
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setPasswordNotMatchError('');
        setEmailErrorMessage('');
        setPassErrorMessage('');
        setDisplayNameErrorMessage('');


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
                setSuccessfulLogIn(true);
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

    //RL: Adding validation for password and displayname to be > length 0
    const validatePassword = (password) => {
        return password.length > 0;
    }
    //RL: Not sure what's going on with password stuff on register page, so I'm leaving this
    //here for the time being
    //{passErrorMessage && <div style={{color: 'red'}}>{passErrorMessage}</div>}

    const validateDisplayName = (displayName) => {
        return displayName.length > 0;
    }

    const handlePasswordCheck = (input_password, check_password) => {
        return input_password == check_password;
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
                    {emailErrorMessage && <div style={{color: 'red'}}>{emailErrorMessage}</div>}
                    <br />
                    <input type="password" value={input_password} onChange={handlePasswordChange} placeholder="Password" />
                    {passErrorMessage && <div style ={{color: 'red'}}>{passErrorMessage}</div>}
                    <br />
                    <button className="btn" onClick={handleForgottenPassword}>Forgot Password?</button>
                    <br />
                    {passwordMessage && <div style = {{color: 'red'}}>{passwordMessage}</div>}
                    <br />
                    <button className="btn" onClick={handleSubmitLogin}>Log In</button>
                    <p className = "p">
                        Don't have an account? 
                        <button className="btn" onClick={() => handlePageSwitch(false)}>Register</button>
                    </p>
                </>
            ) : (
                <>
                    <h2 className="h2">Register</h2>
                    <input type="text" value={input_displayname} onChange={handleDisplaynameChange} placeholder="Displayname"/>
                    <br />
                    {displayNameErrorMessage && <div style={{color: 'red'}}>{displayNameErrorMessage}</div>}
                    <input type="email" value={input_email} onChange={handleEmailChange} placeholder="Email" />
                    <br />
                    {emailErrorMessage && <div style={{color: 'red'}}>{emailErrorMessage}</div>}
                    {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
                    <input type = {passwordNoteVisible ? "text" : "password"}  value={input_password} onChange={handlePasswordChange} placeholder="Password"/>
                    <br />
                    <input type= {passwordNoteVisible ? "text" : "password"} value={check_password} onChange={handleCheckPasswordChange} placeholder="Confirm Password"/> 
                    <br />
                    <p>
                    {passErrorMessage && <div style={{color: 'red'}}>{passErrorMessage}</div>}
                    {passwordNotMatchError && <div style={{color: 'red'}}>{passwordNotMatchError}</div>}
                    </p>
                    <p className="p" id = "pwdnote" >
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
            {successfulLogIn && (
                <div style = {{color: 'white'}}>
                    <p> Successful Login! Loading homepage now....</p>
                    <p> This could totally take less time but it's purely experimental</p>
                </div>
            )}
        </div>
      </div>
    );
};
