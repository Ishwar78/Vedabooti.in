import React, { useState } from "react";
import { FiMail, FiPhone, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import "./AdminContact.css";

export default function AdminContact() {
  const [search, setSearch] = useState("");

  const contacts = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", subject: "Product Information", date: "23 Sep 2026", status: "New" },
    { id: 2, name: "Priya Verma", email: "priya@example.com", phone: "+91 99887 66554", subject: "Order Related Query", date: "22 Sep 2026", status: "Read" },
    { id: 3, name: "Amit Kumar", email: "amit@example.com", phone: "+91 91234 56789", subject: "Wholesale Inquiry", date: "21 Sep 2026", status: "Replied" },
  ];

  const filtered = contacts.filter((item) =>
    `${item.name} ${item.email} ${item.subject}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="admin-page contact-page">
        <div className="admin-page-head">
          <div>
            <span className="admin-kicker">CUSTOMER COMMUNICATION</span>
            <h1>Contact Messages</h1>
            <p>Manage messages received through the website contact form.</p>
          </div>
          <div className="admin-stat-card"><FiMail /><strong>{contacts.length}</strong><span>Total Messages</span></div>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search"><FiSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." /></div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong><small>{item.phone}</small></td>
                  <td>{item.email}</td><td>{item.subject}</td><td>{item.date}</td>
                  <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td className="action-buttons"><button title="View"><FiEye /></button><button title="Delete" className="danger"><FiTrash2 /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}