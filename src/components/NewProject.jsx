import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../config/Firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../styles/Form.scss';

const NewProject = () => {
    const [projects, setProjects] = useState([]);
    const [userId, setUserId] = useState('')
    const titleRef = useRef();
    const descRef = useRef();
    const statusRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();

            if (authObj) {
                const uid = auth.currentUser.uid;
                setUserId(uid);
                //console.log(uid)

                getDoc(doc(firestore, uid, 'projects'))
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            setProjects(docSnap.data().projects);
                        } else {
                            console.log('No such document!');
                        }
                    })
                    .catch((err) => {
                        console.log('Error getting document: ', err);
                    });
            } else {
                console.log('User is not logged in');
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newEntry = {
            title: titleRef.current.value,
            description: descRef.current.value,
            issues: [],
            id: projects.length + 1,
            // date: new Date().toLocaleDateString(),
            // updated: new Date().toLocaleDateString(),
            status: statusRef.current.value
        };

        try {
            const ref = doc(firestore, userId, 'projects');
            updateDoc(ref, {
                projects: arrayUnion(newEntry),
            });
        } catch (err) {
            console.log(err);
        };

        navigate(`/dashboard/${newEntry.id}`);

    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <h3>Add a new project</h3>
                <div className='input-group'>
                    <label for='title-input'>Title</label>
                    <br/>
                    <input type='text' ref={titleRef} id='title-input'></input>
                </div>

                <div className='input-group'>
                    <label for='desc-input'>Description</label>
                    <br/>
                    <input type='text' ref={descRef} id='desc-input'></input>
                </div>

                <div className='input-group'>
                    <label for='status-input'>Project status</label>
                    <select ref={statusRef} id='status-input'>
                        <option value='Active'>Active</option>
                        <option value='Complete'>Complete</option>
                    </select>
                </div>

                <button className='primary' type='submit'>Submit</button>
            </form>
        </main>
    )
};

export default NewProject;