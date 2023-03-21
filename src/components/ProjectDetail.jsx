import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, firestore } from "../config/Firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const ProjectDetail = () => {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState('');
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState('');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;
        setUserId(uid);

        getDoc(doc(firestore, uid, "projects"))
          .then((docSnap) => {
            if (docSnap.exists()) {
              //binary search of books
              function searchProjects(targetId, projectArr) {
                let start = 0;
                let end = projectArr.length - 1;

                while (start <= end) {
                  let middle = Math.floor((start + end) / 2);
                  if (projectArr[middle].id === targetId) {
                    setCurrentProject(projectArr[middle]);
                    setProjects(docSnap.data().projects);
                    setTickets(projectArr[middle].issues);
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

  const issues = tickets.map((ticket) => {
    return (
        <div className='item-wrapper'>
            <div className='list-item'>
                <p>{ticket.title}</p>    
            </div>

            <div className='list-item'>
                <p>{ticket.description}</p>
            </div>
            
            <div className='list-item'>
                <ul>
                    <li>{ticket.type}</li>
                    <li>{ticket.status}</li>
                </ul>
            </div>
            
            <div className='list-item'>
                <p>{ticket.date}</p>    
            </div>
            
        </div>  
    )
  })

  return (
    <main>
        <h1>{currentProject.title}</h1>
        <p>{currentProject.description}</p>
        <section>
            <Link to={'newticket'}>add a ticket</Link>
            <div className="data">
            <div className='item-wrapper'>
            <div className='list-item'>
                <p>title</p>    
            </div>

            <div className='list-item'>
                <p>Description</p>
            </div>
            
            <div className='list-item'>
                <ul>
                    <li>Type</li>
                    <li>Status</li>
                </ul>
            </div>
            
            <div className='list-item'>
                <p>Date</p>    
            </div>
            
            </div>  
                {issues}
            </div>
        </section>  
    </main>
    
  )
};

export default ProjectDetail;