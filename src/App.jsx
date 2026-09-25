import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

// ================================
// PUBLIC PAGES
// ================================
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Categories from "./pages/Categories/Categories";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Testimonials from "./pages/Testimonials/Testimonials";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import Search from "./pages/Search/Search";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Checkout from "./pages/Checkout/Checkout";
import ThankYou from "./pages/ThankYou/ThankYou";
import Invoice from "./pages/Invoice/Invoice";

import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions/TermsConditions";
// ================================
// USER PAGES
// ================================
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Profile from "./pages/Profile/Profile";
import Orders from "./pages/Orders/Orders";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import Addresses from "./pages/Addresses/Addresses";
import Support from "./pages/Support/Support";
import Contact from "./pages/Contact/Contact";

// ================================
// ADMIN PAGES
// ================================
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminCategories from "./pages/AdminCategories/AdminCategories";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminCoupons from "./pages/AdminCoupons/AdminCoupons";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import AdminSupport from "./pages/AdminSupport/AdminSupport";
import AdminHero from "./pages/AdminHero/AdminHero";


import AdminContact from "./pages/AdminContact/AdminContact";
import AdminInquiry from "./pages/AdminInquiry/AdminInquiry";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminReviews from "./pages/AdminReviews/AdminReviews";
import AdminCreateReview from "./pages/AdminCreateReview/AdminCreateReview";
import AdminVideos from "./pages/AdminVideos/AdminVideos";
import AdminReturnRequests from "./pages/AdminReturnRequests/AdminReturnRequests";



export default function App() {
    return (
        <>
            {/* Scroll To Top Button */}
            <ScrollToTop />

            <Routes>

                {/* =====================================
                    PUBLIC ROUTES
                ===================================== */}

                <Route path="/" element={<Home />} />

                <Route path="/shop" element={<Shop />} />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/product/:slug"
                    element={<ProductDetail />}
                />

                <Route
                    path="/testimonials"
                    element={<Testimonials />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/blog"
                    element={<Blog />}
                />

                <Route
                    path="/search"
                    element={<Search />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/thank-you"
                    element={<ThankYou />}
                />

                <Route
                    path="/invoice/:orderId"
                    element={<Invoice />}
                />

                <Route 
                       path="/shipping-policy"
                       element={<ShippingPolicy />}
                       />
              
                 <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
                 <Route path="/terms-&-condition" element={<TermsConditions />} />
      
              {/* user  */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<SignUp />}
                />

                <Route
                    path="/register"
                    element={<SignUp />}
                />

                <Route
                    path="/user"
                    element={<UserDashboard />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/order-details"
                    element={<OrderDetails />}
                />

                <Route
                    path="/addresses"
                    element={<Addresses />}
                />

                <Route
                    path="/support"
                    element={<Support />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />


                {/* =====================================
                    ADMIN LOGIN
                ===================================== */}

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />


                {/* =====================================
                    ADMIN EXISTING ROUTES
                ===================================== */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/categories"
                    element={<AdminCategories />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

                <Route
                    path="/admin/coupons"
                    element={<AdminCoupons />}
                />

                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />

                <Route
                    path="/admin/support"
                    element={<AdminSupport />}
                />

                <Route
                    path="/admin/hero"
                    element={<AdminHero />}
                />


                {/* =====================================
                    ADMIN CONTACT
                ===================================== */}

                <Route
                    path="/admin/contact"
                    element={<AdminContact />}
                />


                {/* =====================================
                    ADMIN INQUIRY
                ===================================== */}

                <Route
                    path="/admin/inquiry"
                    element={<AdminInquiry />}
                />


                {/* =====================================
                    ADMIN USERS
                ===================================== */}

                <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                />


                {/* =====================================
                    ADMIN REVIEWS
                ===================================== */}

                <Route
                    path="/admin/reviews"
                    element={<AdminReviews />}
                />


                {/* =====================================
                    CREATE REVIEW
                ===================================== */}

                <Route
                    path="/admin/create-review"
                    element={<AdminCreateReview />}
                />


                {/* =====================================
                    ADMIN VIDEOS
                ===================================== */}

                <Route
                    path="/admin/videos"
                    element={<AdminVideos />}
                />


                {/* =====================================
                    RETURN REQUESTS
                ===================================== */}

                <Route
                    path="/admin/return-requests"
                    element={<AdminReturnRequests />}
                />


                {/* =====================================
                    404
                ===================================== */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </>
    );
}