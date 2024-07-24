// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/chats';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setAvatar" element={<SetAvatar/>}/>
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
