import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './config/AuthContext';
import './styles/App.scss'

//COMPONENTS
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NewProject from './components/NewProject';
import ProtectedRoute from './config/ProtectedRoute';
import ProjectDetail from './components/ProjectDetail';
import NewTicket from './components/NewTicket';
import TicketDetail from './components/TicketDetail';
import EditProject from './components/EditProject';
import EditTicket from './components/EditTicket';

function App() {

  return (
    <AuthContextProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/newproject' element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
        <Route path='/dashboard/:projectId' element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path='/dashboard/:projectId/newticket' element={<ProtectedRoute><NewTicket /></ProtectedRoute>} />
        <Route path='/dashboard/:projectId/:ticketId' element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
        <Route path='/dashboard/:projectId/edit' element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path='/dashboard/:projectId/:ticketId/edit' element={<ProtectedRoute><EditTicket /></ProtectedRoute>} />
      </Routes>  
    </AuthContextProvider>
  )
}

export default App