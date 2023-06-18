import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './config/AuthContext';
import './styles/App.scss'

//COMPONENTS
import SignUp from './components/forms/SignUp';
import SignIn from './components/forms/SignIn';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import NewProject from './components/new-project/NewProject';
import ProtectedRoute from './config/ProtectedRoute';
import ProjectDetail from './components/project-detail/ProjectDetail';
import NewTicket from './components/new-ticket/NewTicket';
import TicketDetail from './components/ticket-detail/TicketDetail';
import EditProject from './components/edit-project/EditProject';
import EditTicket from './components/edit-ticket/EditTicket';
import Account from './components/account/Account';

function App() {

  return (
    <AuthContextProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/newproject' element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
        <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
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