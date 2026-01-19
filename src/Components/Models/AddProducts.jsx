import React, { useState } from 'react';
import './AddProduct.css';
import { FiSearch } from 'react-icons/fi';
import { BsFileText, BsCheck, BsBoxSeam } from 'react-icons/bs';
import { IoAddOutline } from 'react-icons/io5';
import { BiCircle } from 'react-icons/bi';
import { MdRadioButtonChecked } from 'react-icons/md';

export default function ProductForm() {
  const [selectedSize, setSelectedSize] = useState('9');
  const [selectedGender, setSelectedGender] = useState('Woman');

  return (
    <div className="container">
      <header className="header">
        <div className="logo">OverView</div>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search" />
          <div className="keyboard-shortcut">
            <span className="key-icon">⌘</span>
            <span>K</span>
          </div>
        </div>
        <div className="header-controls">
          <select className="dropdown">
            <option>Jan</option>
            <option>Feb</option>
            <option>Mar</option>
            <option>Apr</option>
            <option>May</option>
            <option>Jun</option>
            <option>Jul</option>
            <option>Aug</option>
            <option>Sep</option>
            <option>Oct</option>
            <option>Nov</option>
            <option>Dec</option>
          </select>
          <select className="dropdown">
            <option>Sales</option>
          </select>
          {/* <div className="user-info">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamisato" alt="User" className="avatar" />
            <div className="user-details">
              <div className="user-name">Kamisato Aya</div>
              <div className="user-role">Manager</div>
            </div>
            <div className="status-indicator"></div>
          </div> */}
        </div>
      </header>

      <div className="page-header">
        <div className="page-title">
          <BsBoxSeam className="title-icon" />
          <h1>Add New Product</h1>
        </div>
        <div className="action-buttons">
          <button className="btn-draft">
            <BsFileText />
            <span>Save Draft</span>
          </button>
          <button className="btn-add">
            <BsCheck />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="content-grid">
        <div className="left-column">
          <div className="card">
            <h2 className="card-title">General Information</h2>
            
            <div className="input-group">
              <label>Name Product</label>
              <input 
                type="text" 
                value="Air Max Running Shoes Premium Edition" 
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Description Product</label>
              <textarea 
                className="textarea-field"
                value="Premium running shoes featuring advanced cushioning technology. Breathable mesh upper with synthetic overlays for support. Air Max unit in the heel for superior impact absorption. Rubber outsole with flex grooves for natural motion. Padded collar and tongue for comfort. Lace-up closure for secure fit."
              />
            </div>
          </div>

          <div className="card size-gender-card">
            <div className="size-gender-container">
              <div className="size-section">
                <h3 className="section-title">Size</h3>
                <p className="section-subtitle">Pick Available Size</p>
                <div className="size-buttons">
                  {['7', '8', '9', '10', '11'].map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="gender-section">
                <h3 className="section-title">Gender</h3>
                <p className="section-subtitle">Pick Available Gender</p>
                <div className="gender-buttons">
                  <button
                    className={`gender-btn ${selectedGender === 'Men' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('Men')}
                  >
                    {selectedGender === 'Men' ? <MdRadioButtonChecked /> : <BiCircle />}
                    <span>Men</span>
                  </button>
                  <button
                    className={`gender-btn ${selectedGender === 'Woman' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('Woman')}
                  >
                    {selectedGender === 'Woman' ? <MdRadioButtonChecked /> : <BiCircle />}
                    <span>Woman</span>
                  </button>
                  <button
                    className={`gender-btn ${selectedGender === 'Unisex' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('Unisex')}
                  >
                    {selectedGender === 'Unisex' ? <MdRadioButtonChecked /> : <BiCircle />}
                    <span>Unisex</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Pricing And Stock</h2>
            
            <div className="pricing-grid">
              <div className="input-group">
                <label>Base Pricing</label>
                <input 
                  type="text" 
                  value="$47.55" 
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Stock</label>
                <input 
                  type="text" 
                  value="77" 
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Discount</label>
                <input 
                  type="text" 
                  value="10%" 
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label>Discount Type</label>
                <div className="select-field">
                  <input 
                    type="text" 
                    value="Chinese New Year Discount" 
                    className="input-field"
                  />
                  <div className="select-indicator"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <h2 className="card-title">Upload Img</h2>
            <div className="image-preview">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop" 
                alt="Product" 
              />
            </div>
            <div className="thumbnail-grid">
              <div className="thumbnail active">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" alt="Thumb 1" />
              </div>
              <div className="thumbnail">
                <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop" alt="Thumb 2" />
              </div>
              <div className="thumbnail">
                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop" alt="Thumb 3" />
              </div>
              <button className="add-thumbnail">
                <IoAddOutline />
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Category</h2>
            <div className="input-group">
              <label>Product Category</label>
              <div className="select-field">
                <input 
                  type="text" 
                  value="Jacket" 
                  className="input-field"
                />
                <div className="select-indicator"></div>
              </div>
            </div>
            <button className="btn-add-category">Add Category</button>
          </div>
        </div>
      </div>
    </div>
  );
}