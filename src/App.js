import './App.css';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// import Home from './layout/Home';
import MinhWorkSpace from './layout/MinhWorkSpace';
import Home from './layout/Home';
import Custom from './layout/Custom';

function App() {
  return (
    <>
      <Routes>
        <Route path='/nghe-thuat-sang-tao' element={<MinhWorkSpace/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/custom' element={<Custom/>}/>
      </Routes>
    </>
  );
}

export default App;
