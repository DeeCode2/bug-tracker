import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { auth, firestore } from '../../config/Firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const ProjectDetail = () => {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState('');
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState('');
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState('');

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

  let issues = tickets.filter((ticket) => {
    if (query === '') {
      return ticket;
    } else if (ticket.title.toLowerCase().includes(query.toLowerCase())) {
      return ticket;
    }
  })
  .map((ticket) => {
    return (
      <div className='item-wrapper' key={ticket.id}>
        <div className='list-item'>
          <p>{ticket.title}</p>
        </div>

        <div className='list-item'>
          <p className='tag' data-tag={ticket.type}>{ticket.type}</p>
        </div>

        <div className='list-item'>
          <p className='tag' data-tag={ticket.status}>{ticket.status}</p>
        </div>

        <div className='list-item'>
          <Link className='action' to={`/dashboard/${projectId}/${ticket.id}`}>
            Detail
          </Link>
          <Link className='action' to={`${ticket.id}/edit`}>
            Edit
          </Link>
        </div>
      </div>
    );
  });

  //reverse array to get most recent one first
  let reversedTickets = issues;
  let ticketList = [...reversedTickets].reverse();

  //console.log(currentProject.date)

  return (
    <main>
      {/* <h1>{currentProject.title}</h1>
      <p>{currentProject.description}</p> */}

      <section id='stats'>
        <div className='stat'>
          <p>
            <span>Project name: </span>{currentProject.title}
          </p>

          <p>
            <span>Description: </span>{currentProject.description}
          </p>

          <p>
            <span>ID: </span>{currentProject.id}
          </p>

          <p>
            <span>Status: </span>{currentProject.status}
          </p>

          {/* <p>
            <span>Created: </span>{currentProject.date}
          </p>

          <p>
            <span>Updated: </span>{currentProject.updated}
          </p> */}

          <Link className='action' to={`/dashboard/${projectId}/edit`}>
            Edit
          </Link>
        </div>

        <div className='stat'>
          {/* <p>
            <span>Total tickets: {tickets.length}</span>
          </p> */}

          <p>
            <span>Open tickets: </span>
            {tickets.filter((ticket) => ticket.status === 'Open').length}
          </p>

          <p>
            <span>In progress tickets: </span>
            {tickets.filter((ticket) => ticket.status === 'Open').length}
          </p>

          <p><span>Closed tickets: </span>{tickets.filter((ticket) => 
            ticket.status === 'Closed'
          ).length}</p>

        </div>
      </section>
      <div className='new-item'>
        <Link className='primary' to={'newticket'}>
          Add a ticket
        </Link>
      </div>
      <section className='table'>
        <div className='table-header'>
          <h2>Tickets</h2>

          <input type='text' onChange={(e) => setQuery(e.target.value)} placeholder='Search' />
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
