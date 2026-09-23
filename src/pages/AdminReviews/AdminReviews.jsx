import React, { useState } from "react";
import { FiStar, FiSearch, FiEye, FiTrash2, FiCheck } from "react-icons/fi";
import "./AdminReviews.css";

export default function AdminReviews() {
  const [status, setStatus] = useState("All");
  const reviews = [
    {id:1,name:"Rahul Sharma",product:"Ashwagandha",rating:5,text:"Very good product and quality.",date:"23 Sep 2026",status:"Approved"},
    {id:2,name:"Priya Verma",product:"Herbal Tea",rating:4,text:"Nice taste and fast delivery.",date:"22 Sep 2026",status:"Pending"},
    {id:3,name:"Amit Kumar",product:"Immunity Boost",rating:5,text:"Packaging was excellent.",date:"21 Sep 2026",status:"Approved"},
  ];
  const data=reviews.filter(x=>status==="All"||x.status===status);
  return <div className="admin-page reviews-page">
    <div className="admin-page-head"><div><span className="admin-kicker">CUSTOMER FEEDBACK</span><h1>Reviews</h1><p>Review, approve and manage customer feedback.</p></div><div className="review-rating"><FiStar/><strong>4.7</strong><span>Average Rating</span></div></div>
    <div className="admin-toolbar"><div className="admin-search"><FiSearch/><input placeholder="Search reviews..." /></div><div className="filter-buttons">{["All","Pending","Approved"].map(x=><button className={status===x?"active":""} key={x} onClick={()=>setStatus(x)}>{x}</button>)}</div></div>
    <div className="reviews-grid">{data.map(x=><article className="review-card" key={x.id}><div className="review-top"><strong>{x.name}</strong><span>{x.date}</span></div><small>{x.product}</small><div className="stars">{[1,2,3,4,5].map(i=><FiStar key={i} className={i<=x.rating?"filled":""}/>)}</div><p>"{x.text}"</p><div className="review-actions"><span className={`status-badge ${x.status.toLowerCase()}`}>{x.status}</span><button><FiEye/></button>{x.status==="Pending"&&<button><FiCheck/></button>}<button className="danger"><FiTrash2/></button></div></article>)}</div>
  </div>;
}