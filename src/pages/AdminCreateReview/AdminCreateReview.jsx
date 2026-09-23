import React, { useState } from "react";
import { FiStar, FiSave, FiImage } from "react-icons/fi";
import "./AdminCreateReview.css";

export default function AdminCreateReview() {
  const [rating,setRating]=useState(5);
  return <div className="admin-page create-review-page">
    <div className="admin-page-head"><div><span className="admin-kicker">CONTENT MANAGEMENT</span><h1>Create Review</h1><p>Create a review/testimonial to display on the website.</p></div></div>
    <form className="review-form" onSubmit={e=>e.preventDefault()}>
      <div className="form-section"><h2>Review Details</h2><div className="form-grid"><label>Customer Name<input placeholder="Enter customer name" /></label><label>Product Name<input placeholder="Enter product name" /></label><label className="full">Customer Email<input type="email" placeholder="Enter email address" /></label><label className="full">Review Message<textarea rows="5" placeholder="Write review message..." /></label></div></div>
      <div className="form-section"><h2>Rating</h2><div className="rating-picker">{[1,2,3,4,5].map(i=><button type="button" key={i} onClick={()=>setRating(i)} className={i<=rating?"selected":""}><FiStar/></button>)}<span>{rating} / 5</span></div></div>
      <div className="form-section"><h2>Customer Image</h2><label className="upload-box"><FiImage/><span>Click to upload customer image</span><small>PNG, JPG or WEBP</small><input type="file" accept="image/*" /></label></div>
      <div className="form-actions"><button type="button" className="cancel-btn">Cancel</button><button className="gold-btn"><FiSave/> Save Review</button></div>
    </form>
  </div>;
}