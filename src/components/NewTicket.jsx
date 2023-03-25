import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, firestore } from "../config/Firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "../styles/Form.scss";

const NewTicket = () => {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState("");
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState("");

  const titleRef = useRef();
  const descRef = useRef();
  const typeRef = useRef();
  const statusRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      unsub();

      if (authObj) {
        const uid = auth.currentUser.uid;
        setUserId(uid);

        getDoc(doc(firestore, uid, "projects"))
          .then((docSnap) => {
            if (docSnap.exists()) {
              //binary search of projects
              function searchProjects(targetId, projectArr) {
                let start = 0;
                let end = projectArr.length - 1;

                while (start <= end) {
                  let middle = Math.floor((start + end) / 2);
                  if (projectArr[middle].id === targetId) {
                    setCurrentProject(projectArr[middle]);
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
              setProjects(docSnap.data().projects);
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

  function uniqueID() {
    return Math.floor(Math.random() * Date.now());
  }

  const newId = uniqueID();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticket = [
      {
        title: titleRef.current.value,
        description: descRef.current.value,
        type: typeRef.current.value,
        status: statusRef.current.value,
        // date: new Date().toLocaleDateString(),
        //updated: new Date().toLocaleDateString(),
        id: newId,
      },
    ];

    const updatedProject = {
      title: currentProject.title,
      description: currentProject.description,
      id: Number(projectId),
      issues: currentProject.issues.concat(ticket),
      status: currentProject.status
    };

    //get current position of project and replace it with the updated version
    const newProjectList = projects;
    //cosnt projectIndex =
    newProjectList[
      newProjectList.indexOf(
        projects.filter((project) => project.id === Number(projectId))[0]
      )
    ] = updatedProject;

    try {
      const ref = doc(firestore, userId, "projects");
      updateDoc(ref, {
        projects: newProjectList,
      });
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      navigate(`/dashboard/${Number(projectId)}`);
    }, 5000);

    setTimeout();
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Title</label>
          <input type="text" ref={titleRef} />
        </div>

        <div className="input-group">
          <label>Description</label>
          <input type="text" ref={descRef} />
        </div>

        <div className="input-group">
          <label>Ticket type</label>
          <select ref={typeRef}>
            <option value="bug">Bug</option>
            <option value="ui-ux">UI/UX</option>
            <option value="feature">Feature request</option>
          </select>
        </div>

        <div className="input-group">
          <label>Ticket status</label>
          <select ref={statusRef}>
            <option value="Unassigned">Unassigned</option>
            <option value="Open">Open</option>
            <option value="In progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <button className="primary">Submit</button>
      </form>
    </main>
  );
};

export default NewTicket;
