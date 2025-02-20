import './App.css';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// import Home from './layout/Home';
import MinhWorkSpace from './layout/MinhWorkSpace';
import Home from './layout/Home';
import Custom from './layout/Custom';
import Hieuworkspace from './layout/HieuWorkSpace';

function App() {
  return (
    <>
      <Routes>
        <Route path='/3d/nghe-thuat-sang-tao' element={<MinhWorkSpace/>}/>
        <Route path='/3d/home' element={<Home/>}/>
        <Route path='/3d/custom' element={<Custom/>}/>
        <Route path='/3d/hieu' element={<Hieuworkspace/>}/>
      </Routes>
    </>
  );
}

export default App;
