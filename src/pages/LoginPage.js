import React, { useState } from 'react';


function LoginPage() {
    const [isSignIn, setIsSignIn] = useState(true); 
    const [email, setEmail] = useState('');

    const handleToggleMode = () => {
        setIsSignIn(!isSignIn);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className="container">
            <h1>{"Welcome to SportsCar Spotter"}</h1>
            {
            //Since value is set to True, will default to Sign in. Else, header changes to Create Account.
            }
            <h2>{isSignIn ? 'Sign In' : 'Create Account'}</h2> 

            {
            //Conditional Rendering Statement. If !iSignIn (If we are in the Create Account Page), display
            //an extra text box to input an email address. 
            }

            { !isSignIn && (
                <div className="input-group">
                    <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                </div>
            )}
            <div className="input-group">
                <input type="text" placeholder="Username" />
            </div>
            <div className="input-group">
                <input type="password" placeholder="Password" />
            </div>
            { isSignIn && (
                <button className="btn">{'Forgot Password?'}</button>
            )}
            { isSignIn && (
                <br />
            )}
            
    
            {
            // if isSignIn is True, show 'Sign In'; else show 'Create Account'.
            }
            <button className="btn">{isSignIn ? 'Sign In' : 'Create Account'}</button>

            <p>{isSignIn ? "Don't have an account? " : "Already have an account? "} 
               <button className="btn" onClick={handleToggleMode}>
                   {isSignIn ? 'Create Account' : 'Sign In'}
               </button>
            </p>
        </div>
    );
}

export default LoginPage;
