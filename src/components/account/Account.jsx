import React, { useEffect, useState, useRef } from "react";
import { UserAuth } from "../../config/AuthContext.jsx";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { auth, firestore } from "../../config/Firebase.jsx";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import './Account.scss';

const Account = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;
        setUserId(uid);
        setUsername(auth.currentUser.displayName);

        getDoc(doc(firestore, uid, "account"))
          .then((docSnap) => {
            if (docSnap.exists()) {
              //setUsername(docSnap.data().account.username)
              console.log("exists!");
            } else {
              console.log("No such document!");
            }
          })
          .catch((err) => {
            console.log("Error getting document: ", err);
          });
      } else {
        console.log("User is not logged in");
      }
    });
  }, []);

  //change username details
  const changeUsername = async (e) => {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: usernameRef.current.value,
    }).then(() => {
      console.log("username updated");
    });
  };

  //change email details
  const changeEmail = async (e) => {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: emailRef.current.value,
    }).then(() => {
      console.log("username updated");
    });
  };

  //change password
  const changePassword = async (e) => {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: passwordRef.current.value,
    }).then(() => {
      console.log("username updated");
    });
  };

  return (
      <main>
      <h1>Your Account Details</h1>
      <div id="account-forms">
      <form onSubmit={changeUsername}>
        <h3>Change your username</h3>
        <div className='input-group'>
        <label for='username'>Username</label>
        <br />
        <input
            id='username'
            ref={usernameRef}
            type='text'
        />
        </div>
        
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={changeEmail}>
        <h3>Change your email</h3>
        <div className='input-group'>
        <label for='email'>E-mail</label>
        <br />
        <input
            id='email'
            ref={emailRef}
            type='email'
        />
        </div>
        
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={changePassword}>
        <h3>Change your password</h3>
        <div className='input-group'>
        <label for='password'>Password</label>
        <br />
        <input
            id='password'
            ref={passwordRef}
            type='password'
        />
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </div>
    </main>
  );
};

export default Account;
