import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import api, { getVideoUrl } from "../../lib/api";
import "./Testimonials.css";

const defaultStories = [
  { title: "Honey", author: "Priya S.", videoSrc: "/assets/Video.mp4", link: "/shop" },
  { title: "Mushroom Biscuit", author: "Rahul K.", videoSrc: "/assets/Video.mp4", link: "/shop" },
  { title: "Mushroom Biscuit", author: "Sneha M.", videoSrc: "/assets/Video.mp4", link: "/shop" },
  { title: "Natural Wellness", author: "Amit R.", videoSrc: "/assets/Video.mp4", link: "/shop" },
  { title: "Herbal Routine", author: "Neha P.", videoSrc: "/assets/Video.mp4", link: "/shop" },
  { title: "Daily Care", author: "Riya K.", videoSrc: "/assets/Video.mp4", link: "/shop" },
];

export default function Testimonials() {
  const [stories, setStories] = useState(defaultStories);

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        const res = await api.get("/api/videos?status=Active");
        if (isMounted && res && res.videos && res.videos.length > 0) {
          setStories(res.videos);
        }
      } catch (err) {
        console.error("Failed to load testimonial videos:", err);
      }
    };
    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="testimonials-page">
      <SiteHeader />
      <main>
        <section className="simple-hero container">
          <span className="eyebrow">Real Stories · Real Results</span>
          <h1>Video Testimonials</h1>
          <p>Short stories from customers sharing their Veda Booti experience.</p>
        </section>
        <section className="container testimonials-grid">
          {stories.map((item, idx) => (
            <article className="testimonial-video" key={item._id || idx}>
              <div>
                <video
                  src={getVideoUrl(item.videoSrc)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span>▶</span>
              </div>
              <h3>{item.title}</h3>
              <p>
                {item.tag
                  ? `“${item.tag} - Natural, premium and thoughtfully made. I enjoy keeping it in my wellness routine.”`
                  : "“Natural, premium and thoughtfully made. I enjoy keeping it in my wellness routine.”"}
              </p>
              {item.author && <b>— {item.author}</b>}
              <Link to={item.link || "/shop"}>View Product ↗</Link>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
