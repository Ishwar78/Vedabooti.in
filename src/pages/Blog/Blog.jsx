import React from "react";
import {Link} from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./Blog.css";

export default function Blog(){
 return <div className="blog-page"><SiteHeader/><main><section className="simple-hero container"><span className="eyebrow">From Our Journal</span><h1>Ayurveda Insights</h1><p>Practical, simple wellness reading for your everyday routine.</p></section><section className="container blog-list">{[["Herbal Care","5 Ayurvedic Herbs for Better Immunity"],["Skincare","Natural Skincare Tips Using Ayurveda"],["Herbal Tea","The Benefits of Herbal Teas"],["Daily Wellness","How To Build A Simple Wellness Ritual"],["Hair Care","A Gentle Herbal Hair Routine"],["Mind & Sleep","Evening Rituals For A Calmer Day"]].map(([c,t],i)=><article className="blog-item" key={t}><span>{c}</span><h2>{t}</h2><p>Learn simple, practical ideas inspired by traditional wellness and designed for modern routines.</p><Link to="/blog">Read Article →</Link></article>)}</section></main><SiteFooter/></div>
}
