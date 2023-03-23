import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { auth, firestore } from '../config/Firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

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

        getDoc(doc(firestore, uid, 'projects'))
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

  const issues = tickets.map((ticket) => {
    return (
      <div className='item-wrapper'>
        <div className='list-item'>
          <p>{ticket.title}</p>
        </div>

        <div className='list-item'>
          <p className='tag'>
            {ticket.type}
          </p>
        </div>

        <div className='list-item'>
          <p className='tag'>
            {ticket.status}
          </p>
        </div>

        <div className='list-item'> 
          <Link className='action' to={`/dashboard/${projectId}/${ticket.id}`}>Detail</Link>
          <a className='action' href='#'>Edit</a>
        </div>
      </div>
    );
  });

  //reverse array to get most recent one first
  let reversedTickets = issues;
  let ticketList = [...reversedTickets].reverse();


  return (
    <main>
      {/* <h1>{currentProject.title}</h1>
      <p>{currentProject.description}</p> */}

      <section id='stats'>
        <div className='stat'>
          <h3>Project name:</h3>
          <p>{currentProject.title}</p>

          <h3>description:</h3>
          <p>{currentProject.description}</p>

          <h3>Date created:</h3>
          <p>{currentProject.date}</p>

          <h3>Date updated:</h3>
          <p>{currentProject.date}</p>
          
          <Link className='primary'>Edit</Link>
        </div>

        <div className='stat'>
          <h3>Tickets</h3>
          <p>Total: {tickets.length}</p>

          <p>Open tickets: {tickets.filter((ticket) => 
            ticket.status === "Open"
          ).length}</p>

          <p>In progress: {tickets.filter((ticket) => 
            ticket.status === "In progress"
          ).length}</p>

          <p>Closed: {tickets.filter((ticket) => 
            ticket.status === "Closed"
          ).length}</p>

        </div>
      </section>
      <div className='new-item'>
        <Link className='primary' to={'newticket'}>add a ticket</Link>  
      </div>
      <section className='table'>
        <div className='table-header'>
          <h2>Tickets</h2>
          
          <input type='text' placeholder='Search' />
        </div>

        <div className='data'>
          <div className='item-wrapper'>
            <div className='list-item'>
              <p>Title</p>
            </div>

            <div className='list-item'>Type</div>

            <div className='list-item'>Status</div>

            <div className='list-item'>
              <p>Action</p>
            </div>
          </div>
          {ticketList}
        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;