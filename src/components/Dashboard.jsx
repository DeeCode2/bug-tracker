import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../config/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Dashboard.scss';

const Dashboard = () => {
    //array of project data
    const [projects, setProjects] = useState([]);

    //retrieve array of all projects in projects document
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();

            if (authObj) {
                const uid = auth.currentUser.uid;

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
                console.log("User is not logged in");
            }
        });
    }, []);

    const cards = projects.map((project) => {
        return (
            
                <div className='item-wrapper'>
                    <div className='list-item'>
                        <h4>{project.title}</h4>
                    </div>

                    <div className='list-item'>
                        <p>{project.description}</p>    
                    </div>
                    
                    <div className='list-item'>
                        <p>{project.issues.length}</p>    
                    </div>
                    <div className='list-item'>
                        <Link to={`${project.id}`}>Detail</Link>
                        <a href='#'>Edit</a>     
                    </div>
                      
                    
                </div>
            
        )
    })

    return (
        <main>
            <h1>This is your dashboard</h1>
            <section>
                <Link to='/newproject'>Add a new project</Link>
                <div className='data'>

                <div className='item-wrapper'>
                    <div className='list-item'>
                        <h3>Title</h3>
                    </div>

                    <div className='list-item'>
                        <p>Description</p>    
                    </div>
                    
                    <div className='list-item'>
                        <p>Total tickets</p>    
                    </div>
                    <div className='list-item'>
                        <p>Action</p>      
                    </div>
                      
                    
                </div>
                    {cards}    
                </div>
            </section>    
        </main>
    );
};

export default Dashboard;