import React from "react";
import {Link} from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./Testimonials.css";

export default function Testimonials(){
  const stories = [
    ["Honey", "Priya S."],
    ["Mushroom Biscuit", "Rahul K."],
    ["Mushroom Biscuit", "Sneha M."],
    ["Natural Wellness", "Amit R."],
    ["Herbal Routine", "Neha P."],
    ["Daily Care", "Riya K."]
  ];

  return (
    <div className="testimonials-page">
      <SiteHeader/>
      <main>
        <section className="simple-hero container">
          <span className="eyebrow">Real Stories · Real Results</span>
          <h1>Video Testimonials</h1>
          <p>Short stories from customers sharing their Veda Booti experience.</p>
        </section>
        <section className="container testimonials-grid">
          {stories.map(([t, n]) => (
            <article className="testimonial-video" key={t + n}>
              <div>
                <video src="/assets/Video.mp4" autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span>▶</span>
              </div>
              <h3>{t}</h3>
              <p>“Natural, premium and thoughtfully made. I enjoy keeping it in my wellness routine.”</p>
              <b>— {n}</b>
              <Link to="/shop">View Product ↗</Link>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter/>
    </div>
  );
}
