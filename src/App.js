import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDYPVJu-slidFsop1rLAU23FMVD_zq05vA",
  authDomain: "discordclone1-629a3.firebaseapp.com",
  projectId: "discordclone1-629a3",
  storageBucket: "discordclone1-629a3.appspot.com",
  messagingSenderId: "238222141833",
  appId: "1:238222141833:web:fc2127f356c8d31fa9d958",
  measurementId: "G-0VLFNF7BW7"
});
const auth =firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] =useAuthState(auth);
  console.log(user);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? < Chatroom /> : <SignIn />}
      </section>

    </div>
  );
}
function SignIn() {
  const signInWithGoogle =()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    console.log(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
  
}
function SignOut() {
  return auth.currentUser &&(
    <button onClick={()=>auth.signOut( )}>SignOut</button>
  )
  
}
function  Chatroom() {
  const dummy = useRef();
  const messagesRef =firestore.collection('messages');
  console.log(firestore.collection('messages'));

  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages]= useCollectionData(query, {idField: 'id'});
  console.log([messages]);

  const[formValue, setFormValue] = useState('');

  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');

    dummy.current.scrollIntoView({behavior : 'smooth'});
  }

  return(
    <>
    <main className="chatbox">
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
     <div ref={dummy}></div>
    </main>
    
    <form action="" onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
      <button type="submit">🌭</button>
    </form>

    </>
  )
  
}
function ChatMessage(props) {
 const {text, uid, photoURL} =props.message;
 console.log(text);
 const messageClass= uid ===auth.currentUser.uid ? 'sent' : 'received';

  return( 
  <div className={`message${messageClass}`}>
    <img src={photoURL}/>
  <p>{text}</p>
  </div>
  )
}

export default App;
