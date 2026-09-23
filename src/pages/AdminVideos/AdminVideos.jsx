import React, { useState } from "react";
import { FiVideo, FiPlus, FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import "./AdminVideos.css";

export default function AdminVideos() {
  const [videos] = useState([
    {id:1,title:"Veda Booti Introduction",duration:"02:35",date:"23 Sep 2026",status:"Published"},
    {id:2,title:"Herbal Wellness Guide",duration:"04:12",date:"20 Sep 2026",status:"Published"},
    {id:3,title:"Product Usage Guide",duration:"01:48",date:"18 Sep 2026",status:"Draft"},
  ]);
  return (
    <AdminShell>
      <div className="admin-page videos-page">
        <div className="admin-page-head"><div><span className="admin-kicker">MEDIA MANAGEMENT</span><h1>Videos</h1><p>Manage videos displayed across the website.</p></div><button className="gold-btn"><FiPlus/> Add Video</button></div>
        <div className="video-grid">{videos.map(v=><article className="video-card" key={v.id}><div className="video-thumb"><FiVideo/><button><FiPlay/></button></div><div className="video-info"><div><span className={`status-badge ${v.status.toLowerCase()}`}>{v.status}</span><small>{v.duration}</small></div><h3>{v.title}</h3><p>Uploaded on {v.date}</p><div className="video-actions"><button><FiEdit2/> Edit</button><button className="danger"><FiTrash2/> Delete</button></div></div></article>)}</div>
      </div>
    </AdminShell>
  );
}