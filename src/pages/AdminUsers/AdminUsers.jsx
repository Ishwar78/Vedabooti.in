import React, { useState } from "react";
import { FiUsers, FiSearch, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const users = [
    {id:1,name:"Rahul Sharma",email:"rahul@example.com",phone:"+91 98765 43210",orders:8,status:"Active"},
    {id:2,name:"Priya Verma",email:"priya@example.com",phone:"+91 99887 66554",orders:4,status:"Active"},
    {id:3,name:"Amit Kumar",email:"amit@example.com",phone:"+91 91234 56789",orders:2,status:"Blocked"},
    {id:4,name:"Neha Singh",email:"neha@example.com",phone:"+91 90123 45678",orders:11,status:"Active"},
  ];
  const data=users.filter(x=>`${x.name} ${x.email}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="admin-page users-page">
    <div className="admin-page-head"><div><span className="admin-kicker">CUSTOMER MANAGEMENT</span><h1>Users</h1><p>Manage registered customers and their account status.</p></div><button className="gold-btn"><FiUserPlus/> Add User</button></div>
    <div className="user-stats"><div><FiUsers/><strong>{users.length}</strong><span>Total Users</span></div><div><strong>{users.filter(x=>x.status==="Active").length}</strong><span>Active Users</span></div><div><strong>{users.reduce((a,b)=>a+b.orders,0)}</strong><span>Total Orders</span></div></div>
    <div className="admin-toolbar"><div className="admin-search"><FiSearch/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." /></div></div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Phone</th><th>Orders</th><th>Status</th><th>Actions</th></tr></thead><tbody>{data.map(x=><tr key={x.id}><td><strong>{x.name}</strong><small>{x.email}</small></td><td>{x.phone}</td><td>{x.orders}</td><td><span className={`status-badge ${x.status.toLowerCase()}`}>{x.status}</span></td><td className="action-buttons"><button><FiEdit2/></button><button className="danger"><FiTrash2/></button></td></tr>)}</tbody></table></div>
  </div>;
}