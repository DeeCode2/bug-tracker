import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { auth, firestore } from '../config/Firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../styles/Detail.scss';

const TicketDetail = () => {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState('');
  const { projectId, ticketId } = useParams();
  const [currentProject, setCurrentProject] = useState('');
  const [currentTicket, setCurrentTicket] = useState('');
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
              function searchArr(targetId, arr) {
                let start = 0;
                let end = arr.length - 1;

                while (start <= end) {
                  let middle = Math.floor((start + end) / 2);
                  if (arr[middle].id === targetId) {
                    setCurrentProject(arr[middle]);

                    
                    setCurrentTicket(arr[middle].issues.filter((issue) => issue.id === Number(ticketId))[0])
                    setProjects(docSnap.data().projects);
                    setTickets(arr[middle].issues);
                    return middle;
                  } else if (arr[middle].id < targetId) {
                    start = middle + 1;
                  } else {
                    end = middle - 1;
                  }
                }
                return -1;
              }

              searchArr(Number(projectId), docSnap.data().projects);
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

//console.log(currentTicket)
//   console.log(currentProject.issues.filter((issue) => {
//     issue.id !== Number(ticketId);
//   }));

  //console.log(currentProject.issues.filter((issue)))

//   const issues = tickets.map((ticket) => {
//     return (
//       <div className='item-wrapper'>
//         <div className='list-item'>
//           <p>{ticket.title}</p>
//         </div>

//         <div className='list-item'>
//           <p>{ticket.description}</p>
//         </div>

//         <div className='list-item'>
//           <p>
//             {ticket.type} / {ticket.status}
//           </p>
//         </div>

//         <div className='list-item'> 
//           <a className='action' href='#'>Detail</a>
//           <a className='action' href='#'>Edit</a>
        
//         </div>
//       </div>
//     );
//   });

  return (
    <main>
      {/* <h1>{currentProject.title}</h1>
      <p>{currentProject.description}</p> */}

      {/* <section id='stats'>
        <div className='stat'>
          <h3>Ticket name:</h3>
          <p>{currentTicket.title}</p>

          <h3>description:</h3>
          <p>{currentTicket.description}</p>

          <h3>Date created:</h3>
          <p>{currentTicket.date}</p>

          <h3>Date updated:</h3>
          <p>21-03-2023</p>
        </div>

        <div className='stat'>
          <h3>Total projects</h3>
        </div>

        <div className='stat'>
          <h3>Total tickets</h3>
        </div>
      </section>
      <div className='new-item'>
        <Link className='primary' to={'/editticket'}>Edit</Link>  
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

            <div className='list-item'>
              <p>Description</p>
            </div>

            <div className='list-item'>Type / Status</div>

            <div className='list-item'>
              <p>Action</p>
            </div>
          </div>
          {issues}
        </div>
      </section> */}
      <section id='stats' className='detail-section'>
        <div className='stat'>
          <p><span>Title: </span>{currentTicket.title}</p>
          <p><span>Description: </span>{currentTicket.description}</p>
          <p><span>ID: </span>{currentTicket.id}</p>
          {/* <p><span>Date created: </span>{currentTicket.date}</p>
          <p><span>Date updated: </span>{currentTicket.date}</p> */}
          <p><span>Status: </span>{currentTicket.status}</p>
        </div>
      </section>

      {/* <section>
        <h3>Comments</h3>
      </section> */}
    </main>
  );
};

export default TicketDetail;