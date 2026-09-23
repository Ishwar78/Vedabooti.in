import React, { useState } from "react";
import { FiRotateCcw, FiSearch, FiEye, FiCheck, FiX } from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import "./AdminReturnRequests.css";

export default function AdminReturnRequests() {
  const [filter,setFilter]=useState("All");
  const requests=[
    {id:"RR-1001",order:"#ORD-5012",customer:"Rahul Sharma",product:"Ashwagandha",reason:"Damaged product",date:"23 Sep 2026",status:"Pending"},
    {id:"RR-1002",order:"#ORD-4998",customer:"Priya Verma",product:"Herbal Tea",reason:"Wrong product",date:"22 Sep 2026",status:"Approved"},
    {id:"RR-1003",order:"#ORD-4982",customer:"Amit Kumar",product:"Immunity Boost",reason:"Product issue",date:"20 Sep 2026",status:"Rejected"},
  ];
  const data=requests.filter(x=>filter==="All"||x.status===filter);
  return (
    <AdminShell>
      <div className="admin-page returns-page">
        <div className="admin-page-head"><div><span className="admin-kicker">ORDER MANAGEMENT</span><h1>Return Requests</h1><p>Review customer return and replacement requests.</p></div><div className="return-count"><FiRotateCcw/><strong>{requests.filter(x=>x.status==="Pending").length}</strong><span>Pending Requests</span></div></div>
        <div className="admin-toolbar"><div className="admin-search"><FiSearch/><input placeholder="Search request, order or customer..." /></div><div className="filter-buttons">{["All","Pending","Approved","Rejected"].map(x=><button className={filter===x?"active":""} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Request</th><th>Customer</th><th>Product</th><th>Reason</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{data.map(x=><tr key={x.id}><td><strong>{x.id}</strong><small>{x.order}</small></td><td>{x.customer}</td><td>{x.product}</td><td>{x.reason}</td><td>{x.date}</td><td><span className={`status-badge ${x.status.toLowerCase()}`}>{x.status}</span></td><td className="action-buttons"><button><FiEye/></button>{x.status==="Pending"&&<><button><FiCheck/></button><button className="danger"><FiX/></button></>}</td></tr>)}</tbody></table></div>
      </div>
    </AdminShell>
  );
}