import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { auth, firestore } from '../config/Firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../styles/Form.scss';

const EditProject = () => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [userId, setUserId] = useState('')
    const titleRef = useRef();
    const descRef = useRef();
    const statusRef = useRef();
    const { projectId } = useParams();
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
                            function searchProjects(targetId, projectArr) {
                                let start = 0;
                                let end = projectArr.length - 1;
                
                                while (start <= end) {
                                  let middle = Math.floor((start + end) / 2);
                                  if (projectArr[middle].id === targetId) {
                                    setCurrentProject(projectArr[middle]);
                                    setTitle(projectArr[middle].title);
                                    setDescription(projectArr[middle].description);
                                    setStatus(projectArr[middle].status);
                                    setProjects(docSnap.data().projects);
                                    return middle;
                                  } else if (projectArr[middle].id < targetId) {
                                    start = middle + 1;
                                  } else {
                                    end = middle - 1;
                                  }
                                }
                                return -1;
                              }
                
                              searchProjects(Number(projectId), docSnap.data().projects);
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

        const updatedEntry = {
            title: titleRef.current.value,
            description: descRef.current.value,
            issues: [],
            id: Number(projectId),
            //date: currentProject.date,
            //updated: new Date().toLocaleDateString(),
            status: status
        };

        //get array of all projects
        const updatedProjectList = projects;

        //get the current position of project and replace it with updated entry
        updatedProjectList[updatedProjectList.indexOf(projects.filter((project) => project.id === Number(projectId))[0])] = updatedEntry;

         console.log(updatedEntry)
        //console.log(upda)

        try {
            const ref = doc(firestore, userId, 'projects');
            updateDoc(ref, {
                projects: updatedProjectList,
            });
        } catch (err) {
            console.log(err);
        };

        setTimeout(() => {
            navigate(`/dashboard/${Number(projectId)}`);    
        }, 5000)

        setTimeout();

    };

    const deleteProject = async (e) => {
        e.preventDefault();

        //update the list of projects
        const updatedProjectList = projects.filter((project) => 
            project.id !== (Number(projectId))
        );

        try {
            const ref = doc(firestore, userId, 'projects');
            updateDoc(ref, {
                projects: updatedProjectList,
            });
        } catch (err) {
            console.log(err);
        };

        navigate('/dashboard');
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className='edit-form'>
                <h3>Update this project</h3>
                <div className='input-group'>
                    <label for='title-input'>Title</label>
                    <br/>
                    <input type='text' ref={titleRef} defaultValue={title} id='title-input'></input>
                </div>

                <div className='input-group'>
                    <label for='desc-input'>Description</label>
                    <br/>
                    <input type='text' ref={descRef} defaultValue={description} id='desc-input'></input>
                </div>

                <div className='input-group'>
                    <label for='status-input'>Project status</label>
                    <select ref={statusRef} value={status} onChange={(e) => setStatus(e.target.value)} id='status-input'>
                        <option value='Active'>Active</option>
                        <option value='Complete'>Complete</option>
                    </select>
                </div>

                <div className='btn-group'>
                    <button className='primary' type='submit'>Submit</button>
                    <button className='warning' type='button' onClick={deleteProject}>Delete</button>
                </div>
                
            </form>
        </main>
    )
};

export default EditProject;