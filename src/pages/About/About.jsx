import React from "react";
import {Link} from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./About.css";

export default function About(){
 return <div className="about-page"><SiteHeader/><main><section className="about-hero"><div className="container"><span className="eyebrow">Rooted In Nature</span><h1>Ancient Wisdom.<br/><span>Modern Wellness.</span></h1><p>Veda Booti brings thoughtfully selected Ayurvedic wellness products into simple, modern daily rituals.</p></div></section><section className="container about-grid"><div className="about-card"><span>01</span><h2>Our Philosophy</h2><p>We focus on clear ingredients, thoughtful sourcing, careful packaging and a premium customer experience.</p></div><div className="about-card"><span>02</span><h2>Our Promise</h2><p>Natural-first products with transparent information and a calm, premium wellness journey.</p></div><div className="about-card"><span>03</span><h2>Made For Today</h2><p>Traditional inspiration presented in a clean format that fits modern homes and routines.</p></div></section></main><SiteFooter/></div>
}
