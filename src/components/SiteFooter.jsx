import React from "react";
import {Link} from "react-router-dom";
import {FiInstagram,FiFacebook,FiYoutube,FiMail} from "react-icons/fi";
import "./SiteFooter.css";

export default function SiteFooter(){
 return <footer className="site-footer">
  {/* <div className="trust-row">
   <div><span>🚚</span><strong>Free Shipping</strong><small>on orders above ₹499</small></div>
   <div><span>♢</span><strong>Secure Payments</strong><small>100% safe & secure</small></div>
   <div><span>↻</span><strong>Easy Returns</strong><small>Hassle-free returns</small></div>
   <div><span>◉</span><strong>Customer Support</strong><small>We're here to help</small></div>
  </div> */}
  <div className="footer-main container">
   <div className="footer-brand">
    <img src="/assets/veda-booti-logo.png" alt="Veda Booti"/>
    <p>Natural care for a better tomorrow.</p>
    </div>
   <div>
    <h4>Quick Links</h4>
    <Link to="/">Home</Link>
    <Link to="/shop">Shop</Link>
    <Link to="/categories">Categories</Link>
    <Link to="/about">About Us</Link>
    <Link to="/blog">Blog</Link>
    </div>
   <div><h4>Customer Care</h4>
   <Link to="/user">My Account</Link>
   <Link to="/orders">Track Order</Link>
   <Link to="/support">Returns & Refunds</Link>
   <Link to="/support">FAQs</Link>
   <Link to="/support">Shipping Policy</Link>
   </div>
   <div className="newsletter">
    <h4>Subscribe to Our Newsletter</h4>
    <p>Get exclusive offers, health tips and updates.</p>
    <form onSubmit={e=>e.preventDefault()}><input placeholder="Enter your email"/>
    <button className="btn">Subscribe</button>
    </form>
    <div className="socials">
        <FiFacebook/><FiInstagram/><FiYoutube/><FiMail/></div></div>
   <div className="footer-quote">Goodness<br/>from Nature<br/><em>Always.</em></div>
  </div>
  <div className="footer-bottom">
    <span>© 2026 Veda Booti Health Care. All rights reserved.</span>
    <span>Made with ♥ for a healthier tomorrow.</span>
    </div>
 </footer>
}
