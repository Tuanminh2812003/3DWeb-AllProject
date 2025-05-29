import './App.css';
import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';

// import Home from './layout/Home';
import MinhWorkSpace from './layout/MinhWorkSpace';
import Home from './layout/Home';
import Custom from './layout/Custom';
import Hieuworkspace from './layout/HieuWorkSpace';
import Virtouria from "./layout/virtouria";
import Vietdoodle from "./layout/Vietdoodle";
import Dentroi from "./layout/virtouria/den.js";
import QuocKhanh from "./layout/virtouria/quockhanh.js";
import Gom from "./layout/virtouria/gom.js";
import TestGom from "./layout/testGom";

function App() {

  const [slugs, setSlugs] = useState([]);
  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const res = await fetch("https://chisu3000.online/api/v1/culture");
        const data = await res.json();
        const slugList = data.data.map((item) => item.slug);
        setSlugs(slugList);
      } catch (error) {
        console.error("Lỗi khi lấy slug:", error);
      }
    };

    fetchSlugs();
  }, []);

  return (
    <>
      <Routes>
        <Route path='/nghe-thuat-sang-tao' element={<MinhWorkSpace/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='testgom' element={<TestGom/>}/>
        {slugs.map((slug) => (
          <Route key={slug} path={`/customspace/${slug}`} element={<Custom />} />
        ))}
        <Route path='/hieu' element={<Hieuworkspace/>}/>
        <Route path='/vietdoodle' element={<Vietdoodle/>}/>
        <Route path='/virtouria/bia' element={<Virtouria/>}/>
        <Route path='/virtouria/denlong' element={<Dentroi/>}/>
        <Route path='/virtouria/30thang4' element={<QuocKhanh/>}/>
        <Route path='/virtouria/gom' element={<Gom/>}/>
      </Routes>
    </>
  );
}

export default App;
