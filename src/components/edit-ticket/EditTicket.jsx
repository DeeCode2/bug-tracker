import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { auth, firestore } from '../../config/Firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../../styles/Form.scss';

const EditTicket = () => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState('');
    const [currentTicket, setCurrentTicket] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [userId, setUserId] = useState('')
    const titleRef = useRef();
    const descRef = useRef();
    const typeRef = useRef();
    const statusRef = useRef();
    const { projectId, ticketId } = useParams();
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
                                    setCurrentTicket(projectArr[middle].issues.filter((issue) => issue.id === Number(ticketId))[0])
                                    setTitle(projectArr[middle].issues.filter((issue) => issue.id === Number(ticketId))[0].title);
                                    setDescription(projectArr[middle].issues.filter((issue) => issue.id === Number(ticketId))[0].description);
                                    setStatus(projectArr[middle].issues.filter((issue) => issue.id === Number(ticketId))[0].status);
                                    setType(projectArr[middle].issues.filter((issue) => issue.id === Number(ticketId))[0].type);
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

        //update the ticket
        const updatedTicket = {
            title: titleRef.current.value,
            description: descRef.current.value,
            id: Number(ticketId),
            //date: currentTicket.date,
            //updated: new Date().toLocaleDateString(),
            type: typeRef.current.value,
            status: statusRef.current.value
        };

        //replace old ticket with new ticket
        const ticketArr = currentProject.issues;
        ticketArr[currentProject.issues.indexOf(currentTicket)] = updatedTicket;

        const updatedProject = currentProject;
        updatedProject.issues = ticketArr;

        const updatedProjectList = projects;
        updatedProjectList[Number(projectId) - 1] = updatedProject;

        try {
            const ref = doc(firestore, userId, 'projects');
            updateDoc(ref, {
                projects: updatedProjectList,
            });
        } catch (err) {
            console.log(err);
        };

        navigate(`/dashboard/${Number(projectId)}`);
    };

    const deleteTicket = async (e) => {
        e.preventDefault();

        //update the issues array of tickets by filtering the deleted object
        const updatedIssues = currentProject.issues.filter((issue) => 
            issue.id !== (Number(ticketId))
        );

        //replace the previous issues array with the updated one
        const updatedProject = currentProject;
        updatedProject.issues = updatedIssues;

        //replace the old project with the updated project containing the updated issues
        const updatedProjectList = projects;
        updatedProjectList[updatedProjectList.indexOf(projects.filter((project) => project.id === Number(projectId))[0])] = updatedProject;

        try {
            const ref = doc(firestore, userId, 'projects');
            updateDoc(ref, {
                projects: updatedProjectList,
            });
        } catch (err) {
            console.log(err);
        };

        navigate(`/dashboard/${projectId}`);
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className='edit-form'>
                <h3>Update this ticket</h3>
                <div className='input-group'>
                    <label for='title-input'>Title</label>
                    <br/>
                    <input type='text' ref={titleRef} defaultValue={title} id='title-input' required />
                    <p className='required-msg'>Title field must not be empty</p>
                </div>

                <div className='input-group'>
                    <label for='desc-input'>Description</label>
                    <br/>
                    <input type='text' ref={descRef} defaultValue={description} id='desc-input' required />
                    <p className='required-msg'>Description field must not be empty</p>
                </div>

                <div className='input-group'>
                    <label>Ticket type</label>
                    <select ref={typeRef} value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Bug">Bug</option>
                        <option value="Task">Task</option>
                        <option value="New Feature">New Feature</option>
                        <option value="Improvement">Improvement</option>
                        <option value="Test">Test</option>
                    </select>
                </div>

                <div className='input-group'>
                    <label>Ticket status</label>
                    <select ref={statusRef} value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value='Open'>Open</option>
                        <option value='In progress'>In Progress</option>
                        <option value='Resolved'>Resolved</option>
                        <option value='Closed'>Closed</option>
                        <option value='Unassigned'>Unassigned</option>
                    </select>
                </div>

                <div className='btn-group'>
                    <button className='primary' type='submit'>Submit</button>
                    <button className='warning' type='button' onClick={deleteTicket}>Delete</button>
                </div>
                
            </form>
        </main>
    )
};

export default EditTicket;