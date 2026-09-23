import React, { useState } from "react";
import { FiSearch, FiEye, FiCheckCircle, FiClock } from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import "./AdminInquiry.css";

export default function AdminInquiry() {
  const [filter, setFilter] = useState("All");
  const inquiries = [
    { id: 101, name: "Neha Singh", email: "neha@example.com", product: "Ashwagandha", message: "Is this product suitable for daily use?", date: "23 Sep 2026", status: "Pending" },
    { id: 102, name: "Vikas Yadav", email: "vikas@example.com", product: "Herbal Tea", message: "Please share available pack sizes.", date: "22 Sep 2026", status: "Replied" },
    { id: 103, name: "Pooja Jain", email: "pooja@example.com", product: "Immunity Boost", message: "Do you provide bulk orders?", date: "20 Sep 2026", status: "Pending" },
  ];
  const data = inquiries.filter(x => filter === "All" || x.status === filter);

  return (
    <AdminShell>
      <div className="admin-page inquiry-page">
        <div className="admin-page-head"><div><span className="admin-kicker">CUSTOMER QUESTIONS</span><h1>Inquiries</h1><p>View and manage product and customer inquiries.</p></div><div className="inquiry-summary"><div><FiClock/><strong>{inquiries.filter(x=>x.status==="Pending").length}</strong><span>Pending</span></div><div><FiCheckCircle/><strong>{inquiries.filter(x=>x.status==="Replied").length}</strong><span>Replied</span></div></div></div>
        <div className="admin-toolbar"><div className="admin-search"><FiSearch/><input placeholder="Search inquiries..." /></div><div className="filter-buttons">{["All","Pending","Replied"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>
        <div className="inquiry-grid">{data.map(x=><article className="inquiry-card" key={x.id}><div className="inquiry-card-top"><span className={`status-badge ${x.status.toLowerCase()}`}>{x.status}</span><small>{x.date}</small></div><h3>{x.product}</h3><strong>{x.name}</strong><span>{x.email}</span><p>{x.message}</p><button className="gold-btn"><FiEye/> View Inquiry</button></article>)}</div>
      </div>
    </AdminShell>
  );
}