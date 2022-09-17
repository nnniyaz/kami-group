import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import ProductForm from './components/ProductForm';
import ProductEdit from './components/ProductEdit';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='products' element={<App />} />
        <Route path='products/create' element={<ProductForm />} />
        <Route path='products/edit/:id' element={<ProductEdit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
