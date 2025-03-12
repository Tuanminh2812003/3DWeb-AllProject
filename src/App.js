import './App.css';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// import Home from './layout/Home';
import MinhWorkSpace from './layout/MinhWorkSpace';
import Home from './layout/Home';
import Custom from './layout/Custom';
import Hieuworkspace from './layout/HieuWorkSpace';
import Virtouria from "./layout/virtouria";

function App() {
  return (
    <>
      <Routes>
        <Route path='/nghe-thuat-sang-tao' element={<MinhWorkSpace/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/custom' element={<Custom/>}/>
        <Route path='/hieu' element={<Hieuworkspace/>}/>
        <Route path='/virtouria' element={<Virtouria/>}/>
      </Routes>
    </>
  );
}

export default App;
