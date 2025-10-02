import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from 'react'
import MoviePage from './pages/MoviePage'

function App() {
  console.log(import.meta.env.VITE_TMOB_KEY);
  return (
    <>
      <MoviePage/>
    </>
  )
}

export default App
