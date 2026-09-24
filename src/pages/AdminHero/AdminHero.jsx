import React from "react";import {Link} from "react-router-dom";
import AdminShell from "../../components/AdminShell";import "./AdminHero.css";
export default function AdminHero(){return <AdminShell><div className="hero-admin-head">
    <div>
        <span className="eyebrow">Home Page</span>
    <h1>Hero Banner</h1>
    <p>Edit the main message and promotional CTA used on the storefront.</p>
    </div><button className="btn">Save Changes</button></div><form className="hero-editor" onSubmit={e=>e.preventDefault()}><div className="preview"><img src="/assets/hero-reference.jpg" alt="Hero preview"/><div><span className="eyebrow">Ancient Wisdom · Modern Wellness</span><h2>Pure Ayurveda For A Healthier Tomorrow</h2><button className="btn">Shop Now</button></div></div><div className="editor-fields"><label>Eyebrow<input className="input" defaultValue="Ancient Wisdom · Modern Wellness"/></label><label>Headline<input className="input" defaultValue="Pure Ayurveda For A Healthier Tomorrow"/></label><label>Description<textarea className="textarea" defaultValue="Discover the power of authentic herbs and natural care with Veda Booti."/></label><label>Button Text<input className="input" defaultValue="Shop Now"/></label><label>Button Link<input className="input" defaultValue="/shop"/></label></div></form></AdminShell>}