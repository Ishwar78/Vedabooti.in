import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminShell from "../../components/AdminShell";
import api, { getProductImageUrl } from "../../lib/api";
import {
    FiPlus,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiUpload,
    FiTrash2,
    FiEdit2,
    FiEye,
    FiCheck,
    FiRefreshCw
} from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminProducts.css";

export const calculatePricing = (basePriceVal, discountVal, discountType) => {
    const base = Number(basePriceVal) || 0;
    const discount = Number(discountVal) || 0;
    if (base <= 0) return { base: 0, offAmount: 0, sellingPrice: 0, discountTag: "" };

    let offAmount = 0;
    let discountTag = "";

    if (discountType === "Fixed Amount") {
        offAmount = Math.min(discount, base);
        discountTag = discount > 0 ? `₹${discount} OFF` : "";
    } else {
        // Percentage
        const pct = Math.min(Math.max(discount, 0), 100);
        offAmount = Math.round((base * pct) / 100);
        discountTag = discount > 0 ? `${discount}% OFF` : "";
    }

    const sellingPrice = Math.max(0, base - offAmount);
    return {
        base,
        offAmount,
        sellingPrice,
        discountTag,
    };
};

const shortQuillModules = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};

const fullQuillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        ["clean"],
    ],
};

export default function AdminProducts() {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [step, setStep] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All Status");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([
        "Skin Care",
        "Hair Care",
        "Health & Wellness",
        "Immunity",
        "Herbal Teas",
        "Nutrition",
        "Digestive",
        "Mind & Focus",
        "Ayurvedic",
    ]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        productName: "",
        category: "",
        active: true,
        price: "",
        discount: "",
        discountType: "Percentage",
        unit: "Gram",
        shortDescription: "",
        description: "",
        subtitle: "",
        tag: "Bestseller",
        stock: 100,
        weight: "",
        benefits: [""],
        ingredients: [""],
        howToUse: "",
        faq: [
            {
                question: "",
                answer: "",
            },
        ],
        metaTitle: "",
        metaDescription: "",
        metaTags: "",
    });

    const [images, setImages] = useState([]);
    const pricing = calculatePricing(form.price, form.discount, form.discountType);

    // Fetch products from MongoDB
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/products");
            if (res && res.products) {
                setProducts(res.products);
            }
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories dynamically
    const fetchCategories = async () => {
        try {
            const res = await api.get("/api/categories?status=Active");
            if (res && res.categories && res.categories.length > 0) {
                setCategories(res.categories.map((c) => c.name));
            }
        } catch (err) {
            console.error("Failed to load categories:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    /* =========================
       FORM HANDLERS
    ========================= */

    const updateForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /* =========================
       BENEFITS
    ========================= */

    const updateBenefit = (index, value) => {
        const updated = [...form.benefits];
        updated[index] = value;
        setForm({
            ...form,
            benefits: updated,
        });
    };

    const addBenefit = () => {
        setForm({
            ...form,
            benefits: [...form.benefits, ""],
        });
    };

    const removeBenefit = (index) => {
        if (form.benefits.length === 1) return;
        setForm({
            ...form,
            benefits: form.benefits.filter((_, i) => i !== index),
        });
    };

    /* =========================
       INGREDIENTS
    ========================= */

    const updateIngredient = (index, value) => {
        const updated = [...form.ingredients];
        updated[index] = value;
        setForm({
            ...form,
            ingredients: updated,
        });
    };

    const addIngredient = () => {
        setForm({
            ...form,
            ingredients: [...form.ingredients, ""],
        });
    };

    const removeIngredient = (index) => {
        if (form.ingredients.length === 1) return;
        setForm({
            ...form,
            ingredients: form.ingredients.filter((_, i) => i !== index),
        });
    };

    /* =========================
       FAQ
    ========================= */

    const updateFaq = (index, field, value) => {
        const updated = [...form.faq];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setForm({
            ...form,
            faq: updated,
        });
    };

    const addFaq = () => {
        setForm({
            ...form,
            faq: [
                ...form.faq,
                {
                    question: "",
                    answer: "",
                },
            ],
        });
    };

    const removeFaq = (index) => {
        if (form.faq.length === 1) return;
        setForm({
            ...form,
            faq: form.faq.filter((_, i) => i !== index),
        });
    };

    /* =========================
       IMAGE UPLOAD (Multiple)
    ========================= */

    const handleImages = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const remainingSlots = 10 - images.length;

        if (remainingSlots <= 0) {
            alert("You can upload maximum 10 images.");
            return;
        }

        const filesToAdd = selectedFiles.slice(0, remainingSlots);
        const newImages = filesToAdd.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
        e.target.value = "";
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const updated = [...prev];
            if (updated[index]?.file && updated[index]?.url) {
                URL.revokeObjectURL(updated[index].url);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    /* =========================
       OPEN ADD / EDIT
    ========================= */

    const handleOpenAdd = () => {
        resetForm();
        setEditingProduct(null);
        setShow(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);

        // If product has oldPrice > price, base price was oldPrice and price was sellingPrice
        const basePrice = (product.oldPrice && Number(product.oldPrice) > Number(product.price))
            ? product.oldPrice
            : product.price;

        // Parse discount value and type
        let rawDiscount = "";
        let rawDiscountType = product.discountType || "Percentage";
        if (product.discount) {
            const numMatch = String(product.discount).match(/[\d.]+/);
            rawDiscount = numMatch ? numMatch[0] : "";
            if (String(product.discount).includes("₹") || rawDiscountType === "Fixed Amount") {
                rawDiscountType = "Fixed Amount";
            } else if (String(product.discount).includes("%")) {
                rawDiscountType = "Percentage";
            }
        }

        setForm({
            productName: product.name || "",
            category: product.category || "",
            active: product.status === "Active",
            price: basePrice !== undefined && basePrice !== null ? String(basePrice) : "",
            discount: rawDiscount,
            discountType: rawDiscountType,
            unit: product.unit || "Gram",
            shortDescription: product.shortDescription || product.subtitle || "",
            description: product.desc || product.description || "",
            subtitle: product.subtitle || "",
            tag: product.tag || "Bestseller",
            stock: product.stock !== undefined ? product.stock : 100,
            weight: product.weight || "",
            benefits: product.points && product.points.length ? product.points : [""],
            ingredients: product.ingredients && product.ingredients.length ? product.ingredients : [""],
            howToUse: product.howToUse || "",
            faq: product.faq && product.faq.length ? product.faq : [{ question: "", answer: "" }],
            metaTitle: product.metaTitle || "",
            metaDescription: product.metaDescription || "",
            metaTags: product.metaTags || "",
        });

        // Preload existing images
        const existingImgs = (product.images && product.images.length > 0)
            ? product.images
            : (product.image ? [product.image] : []);

        setImages(
            existingImgs.map((img) => ({
                url: getProductImageUrl(img),
                existingPath: img,
            }))
        );

        setStep(1);
        setShow(true);
    };

    /* =========================
       RESET
    ========================= */

    const resetForm = () => {
        setStep(1);
        setForm({
            productName: "",
            category: "",
            active: true,
            price: "",
            discount: "",
            discountType: "Percentage",
            unit: "Gram",
            shortDescription: "",
            description: "",
            subtitle: "",
            tag: "Bestseller",
            stock: 100,
            weight: "",
            benefits: [""],
            ingredients: [""],
            howToUse: "",
            faq: [
                {
                    question: "",
                    answer: "",
                },
            ],
            metaTitle: "",
            metaDescription: "",
            metaTags: "",
        });
        setImages([]);
        setEditingProduct(null);
    };

    const closePopup = () => {
        setShow(false);
        resetForm();
    };

    /* =========================
       STEP VALIDATION
    ========================= */

    const nextStep = () => {
        if (step === 1) {
            if (!form.productName.trim()) {
                alert("Please enter product name.");
                return;
            }
            if (!form.category) {
                alert("Please select category.");
                return;
            }
            if (!form.shortDescription.trim()) {
                alert("Please enter short description.");
                return;
            }
        }

        if (step === 2) {
            if (!form.price) {
                alert("Please enter product price.");
                return;
            }
        }

        if (step < 4) {
            setStep((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    /* =========================
       SAVE PRODUCT TO MONGODB
    ========================= */

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Enforce: only complete Step 4 can submit & save the product to database!
        if (step !== 4) {
            return;
        }

        if (!form.productName.trim()) {
            alert("Please enter product name.");
            setStep(1);
            return;
        }
        if (!form.category) {
            alert("Please select category.");
            setStep(1);
            return;
        }
        if (!form.price) {
            alert("Please enter product price.");
            setStep(2);
            return;
        }

        setSubmitting(true);
        try {
            const pricing = calculatePricing(form.price, form.discount, form.discountType);

            const formData = new FormData();
            formData.append("name", form.productName.trim());
            formData.append("category", form.category.trim());
            // price in DB is the actual selling price customer pays
            formData.append("price", pricing.sellingPrice);
            // oldPrice is the base MRP (if discount was applied)
            formData.append("oldPrice", pricing.offAmount > 0 ? pricing.base : 0);
            formData.append("status", form.active ? "Active" : "Draft");
            formData.append("discount", pricing.discountTag);
            formData.append("discountType", form.discountType || "Percentage");
            formData.append("unit", form.unit || "Gram");
            formData.append("shortDescription", form.shortDescription.trim());
            formData.append("description", form.description.trim());
            formData.append(
                "subtitle",
                form.subtitle
                    ? form.subtitle.trim()
                    : form.shortDescription.replace(/<[^>]*>/g, "").trim()
            );
            formData.append("tag", form.tag || "Bestseller");
            formData.append("stock", form.stock !== "" && form.stock !== undefined ? form.stock : 100);
            formData.append("weight", form.weight || "");
            formData.append("howToUse", form.howToUse || "");
            formData.append("metaTitle", form.metaTitle || "");
            formData.append("metaDescription", form.metaDescription || "");
            formData.append("metaTags", form.metaTags || "");

            // Arrays
            const validBenefits = form.benefits.filter((b) => b && b.trim());
            validBenefits.forEach((b) => formData.append("benefits", b.trim()));

            const validIngredients = form.ingredients.filter((i) => i && i.trim());
            validIngredients.forEach((i) => formData.append("ingredients", i.trim()));

            const validFaqs = form.faq.filter((f) => f.question?.trim() || f.answer?.trim());
            formData.append("faq", JSON.stringify(validFaqs));

            // Preserved existing images
            const preservedExisting = images.filter((img) => img.existingPath).map((img) => img.existingPath);
            preservedExisting.forEach((img) => formData.append("existingImages", img));

            // New image files to upload
            images.filter((img) => img.file).forEach((img) => {
                formData.append("images", img.file);
            });

            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, formData);
                alert("Product updated successfully in database!");
            } else {
                await api.post("/api/products", formData);
                alert("Product created successfully in database!");
            }

            closePopup();
            await fetchProducts();
        } catch (err) {
            console.error("Save product error:", err);
            alert(err.message || "Failed to save product.");
        } finally {
            setSubmitting(false);
        }
    };

    /* =========================
       DELETE PRODUCT
    ========================= */

    const handleDelete = async (product) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete product "${product.name}"?`);
        if (!confirmDelete) return;

        try {
            await api.delete(`/api/products/${product._id}`);
            setProducts((prev) => prev.filter((p) => p._id !== product._id));
            alert("Product deleted successfully from database.");
        } catch (err) {
            alert(err.message || "Failed to delete product.");
        }
    };

    /* =========================
       TOGGLE STATUS (Active/Draft)
    ========================= */

    const handleToggleStatus = async (product) => {
        try {
            const res = await api.patch(`/api/products/${product._id}/status`);
            if (res && res.status) {
                setProducts((prev) =>
                    prev.map((p) => (p._id === product._id ? { ...p, status: res.status } : p))
                );
            }
        } catch (err) {
            alert("Failed to toggle product status.");
        }
    };

    /* =========================
       FILTER
    ========================= */

    const filteredProducts = products.filter((product) => {
        const matchesSearch = `${product.name} ${product.category} ${product.price} ${product.status}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "All Status" ||
            product.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminShell>

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="crud-head">

                <div>
                    <span className="eyebrow">
                        Admin Management
                    </span>

                    <h1>Products</h1>

                    <p>
                        Manage your products with a focused dedicated
                        workspace.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        className="btn"
                        style={{ background: "#0b2518", borderColor: "#1b4a32", color: "#a5b8ad" }}
                        onClick={fetchProducts}
                        title="Refresh products"
                    >
                        <FiRefreshCw className={loading ? "spin" : ""} />
                    </button>
                    <button
                        className="btn add-product-btn"
                        onClick={handleOpenAdd}
                    >
                        <FiPlus />
                        Add New
                    </button>
                </div>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="crud-toolbar">

                <input
                    className="input"
                    placeholder="Search products by name, category, price..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active Only</option>
                    <option value="Draft">Draft Only</option>
                </select>

            </div>


            {/* =========================
                PRODUCT TABLE
            ========================= */}

            <div className="crud-table">

                <div className="table-row table-head">
                    <span>Product</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Stock</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
                        <FiRefreshCw className="spin" size={28} />
                        <p style={{ marginTop: "10px" }}>Loading products from database...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
                        <p>No products found matching your search.</p>
                        <button className="btn" onClick={handleOpenAdd} style={{ marginTop: "10px" }}>
                            <FiPlus /> Add First Product
                        </button>
                    </div>
                ) : (
                    filteredProducts.map((product, index) => {
                        const productImg = getProductImageUrl(
                            product.image || (product.images && product.images[0])
                        );
                        const imgCount = (product.images && product.images.length) || (product.image ? 1 : 0);

                        return (
                            <div
                                className="table-row"
                                key={product._id || product.id || index}
                            >

                                <span
                                    className="product-name-cell"
                                    style={{ display: "flex", alignItems: "center", gap: "12px" }}
                                >
                                    <img
                                        src={productImg}
                                        alt={product.name}
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #1c402e",
                                            background: "#06150e",
                                            flexShrink: 0
                                        }}
                                    />
                                    <div>
                                        <strong style={{ color: "#fff", display: "block", fontSize: "14px" }}>
                                            {product.name}
                                        </strong>
                                        <small style={{ color: "#799285", fontSize: "11px" }}>
                                            📷 {imgCount} {imgCount === 1 ? "image" : "images"}
                                            {product.subtitle ? ` · ${product.subtitle}` : ""}
                                        </small>
                                    </div>
                                </span>

                                <span>
                                    {product.category}
                                </span>

                                <span>
                                    <strong style={{ color: "#e6ca85", fontSize: "14px" }}>
                                        ₹{product.price}
                                    </strong>
                                    {product.oldPrice && Number(product.oldPrice) > Number(product.price) && (
                                        <del style={{ marginLeft: "6px", color: "#6e8478", fontSize: "11px" }}>
                                            ₹{product.oldPrice}
                                        </del>
                                    )}
                                    {product.discount && (
                                        <span style={{ display: "block", fontSize: "11px", color: "#22c55e", fontWeight: 500 }}>
                                            {product.discount}
                                        </span>
                                    )}
                                </span>

                                <span>
                                    <span style={{
                                        display: "inline-block",
                                        padding: "3px 8px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        background: (Number(product.stock) > 0 || product.stock === undefined) ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                                        color: (Number(product.stock) > 0 || product.stock === undefined) ? "#4ade80" : "#f87171"
                                    }}>
                                        {product.stock !== undefined ? `${product.stock} units` : "100 units"}
                                    </span>
                                </span>

                                <span>
                                    <span
                                        className={
                                            product.status === "Active"
                                                ? "status active"
                                                : "status draft"
                                        }
                                        onClick={() => handleToggleStatus(product)}
                                        style={{ cursor: "pointer" }}
                                        title="Click to toggle Active/Draft"
                                    >
                                        {product.status}
                                    </span>
                                </span>

                                <div className="row-actions">

                                    <Link
                                        to={`/product/${product.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on Live Store"
                                        style={{ display: "flex", alignItems: "center" }}
                                    >
                                        <button type="button" title="View Product Page">
                                            <FiEye />
                                        </button>
                                    </Link>

                                    <button
                                        type="button"
                                        title="Edit Product"
                                        onClick={() => handleOpenEdit(product)}
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-action"
                                        title="Delete Product"
                                        onClick={() => handleDelete(product)}
                                    >
                                        <FiTrash2 />
                                    </button>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>


            {/* =====================================================
                ADD / EDIT PRODUCT MODAL
            ===================================================== */}

            {show && (

                <div className="product-modal-overlay">

                    <div className="product-modal">

                        {/* =========================
                            MODAL HEADER
                        ========================= */}

                        <div className="product-modal-header">

                            <div>
                                <span className="modal-eyebrow">
                                    PRODUCT MANAGEMENT
                                </span>

                                <h2>
                                    {editingProduct ? "Edit Product" : "Add New Product"}
                                </h2>

                                <p>
                                    {editingProduct
                                        ? "Update product details and manage all uploaded images."
                                        : "Create and publish a new product with multiple image uploads."}
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closePopup}
                            >
                                <FiX />
                            </button>

                        </div>


                        {/* =========================
                            STEPS
                        ========================= */}

                        <div className="product-steps">

                            <div
                                className={
                                    step >= 1
                                        ? "product-step active"
                                        : "product-step"
                                }
                            >
                                <span>1</span>
                                <div>
                                    <strong>Basic</strong>
                                    <small>Information</small>
                                </div>
                            </div>

                            <div className="step-line"></div>

                            <div
                                className={
                                    step >= 2
                                        ? "product-step active"
                                        : "product-step"
                                }
                            >
                                <span>2</span>
                                <div>
                                    <strong>Pricing</strong>
                                    <small>Details</small>
                                </div>
                            </div>

                            <div className="step-line"></div>

                            <div
                                className={
                                    step >= 3
                                        ? "product-step active"
                                        : "product-step"
                                }
                            >
                                <span>3</span>
                                <div>
                                    <strong>Content</strong>
                                    <small>Images & Info</small>
                                </div>
                            </div>

                            <div className="step-line"></div>

                            <div
                                className={
                                    step >= 4
                                        ? "product-step active"
                                        : "product-step"
                                }
                            >
                                <span>4</span>
                                <div>
                                    <strong>SEO</strong>
                                    <small>Optimization</small>
                                </div>
                            </div>

                        </div>


                        {/* =========================
                            FORM
                        ========================= */}

                        <form
                            className="product-form"
                            onSubmit={(e) => e.preventDefault()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.target.tagName === "INPUT") {
                                    e.preventDefault();
                                    if (step < 4) {
                                        nextStep();
                                    }
                                }
                            }}
                        >

                            {/* =================================================
                                STEP 1
                            ================================================= */}

                            {step === 1 && (

                                <div className="step-content">

                                    <div className="step-title">
                                        <span>STEP 01</span>
                                        <h3>Basic Information</h3>
                                        <p>
                                            Enter the basic information
                                            about your product.
                                        </p>
                                    </div>


                                    <div className="form-grid">

                                        <div className="field full">

                                            <label>
                                                Product Name
                                                <span>*</span>
                                            </label>

                                            <input
                                                className="input"
                                                value={form.productName}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "productName",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter product name"
                                                required
                                            />

                                        </div>


                                        <div className="field">

                                            <label>
                                                Category
                                                <span>*</span>
                                            </label>

                                            <select
                                                className="input"
                                                value={form.category}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Category
                                                </option>

                                                {categories.map(
                                                    (category) => (
                                                        <option
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {category}
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </div>


                                        <div className="field">

                                            <label>
                                                Product Status
                                            </label>

                                            <div className="toggle-wrapper">

                                                <button
                                                    type="button"
                                                    className={
                                                        form.active
                                                            ? "switch active"
                                                            : "switch"
                                                    }
                                                    onClick={() =>
                                                        updateForm(
                                                            "active",
                                                            !form.active
                                                        )
                                                    }
                                                >
                                                    <span></span>
                                                </button>

                                                <div>
                                                    <strong>
                                                        {form.active
                                                            ? "Active"
                                                            : "Draft"}
                                                    </strong>

                                                    <small>
                                                        {form.active
                                                            ? "Product will be visible"
                                                            : "Product will remain hidden"}
                                                    </small>
                                                </div>

                                            </div>

                                        </div>


                                        <div className="field full">

                                            <label>
                                                Short Description
                                                <span>*</span>
                                            </label>

                                            <div className="quill-editor-wrapper">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={form.shortDescription}
                                                    onChange={(val) =>
                                                        updateForm(
                                                            "shortDescription",
                                                            val
                                                        )
                                                    }
                                                    modules={shortQuillModules}
                                                    placeholder="Write a short product description..."
                                                />
                                            </div>

                                        </div>


                                        <div className="field full">

                                            <label>
                                                Full Description
                                            </label>

                                            <div className="quill-editor-wrapper quill-full">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={form.description}
                                                    onChange={(val) =>
                                                        updateForm(
                                                            "description",
                                                            val
                                                        )
                                                    }
                                                    modules={fullQuillModules}
                                                    placeholder="Write complete product description with bold, lists, and formatting..."
                                                />
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                STEP 2
                            ================================================= */}

                            {step === 2 && (

                                <div className="step-content">

                                    <div className="step-title">
                                        <span>STEP 02</span>
                                        <h3>Pricing & Product Details</h3>
                                        <p>
                                            Set product pricing,
                                            discount and selling unit.
                                        </p>
                                    </div>


                                    <div className="form-grid">

                                        <div className="field">

                                            <label>
                                                Price
                                                <span>*</span>
                                            </label>

                                            <div className="input-prefix">
                                                <span>₹</span>

                                                <input
                                                    type="number"
                                                    value={form.price}
                                                    onChange={(e) =>
                                                        updateForm(
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="299"
                                                />
                                            </div>

                                        </div>


                                        <div className="field">

                                            <label>
                                                Discount
                                            </label>

                                            <input
                                                className="input"
                                                type="number"
                                                min="0"
                                                value={form.discount}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "discount",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="10"
                                            />

                                        </div>


                                        <div className="field">

                                            <label>
                                                Discount Type
                                            </label>

                                            <select
                                                className="input"
                                                value={
                                                    form.discountType
                                                }
                                                onChange={(e) =>
                                                    updateForm(
                                                        "discountType",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>
                                                    Percentage
                                                </option>

                                                <option>
                                                    Fixed Amount
                                                </option>
                                            </select>

                                        </div>


                                        <div className="field">

                                            <label>
                                                Unit
                                            </label>

                                            <select
                                                className="input"
                                                value={form.unit}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "unit",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>
                                                    Gram
                                                </option>

                                                <option>
                                                    Kilogram
                                                </option>

                                                <option>
                                                    Milligram
                                                </option>

                                                <option>
                                                    Litre
                                                </option>

                                                <option>
                                                    Millilitre
                                                </option>

                                                <option>
                                                    Piece
                                                </option>

                                                <option>
                                                    Pack
                                                </option>
                                            </select>

                                        </div>


                                        <div className="field">

                                            <label>
                                                Available Stock Quantity (Units) <span>*</span>
                                            </label>

                                            <input
                                                className="input"
                                                type="number"
                                                min="0"
                                                value={form.stock}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "stock",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. 100"
                                                required
                                            />
                                            <small style={{ color: "#799285", fontSize: "11px", marginTop: "4px", display: "block" }}>
                                                Total stock count available for purchase
                                            </small>

                                        </div>


                                        <div className="field">

                                            <label>
                                                Product Net Weight / Measurement
                                            </label>

                                            <input
                                                className="input"
                                                type="text"
                                                value={form.weight}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "weight",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. 500, 250, 60"
                                            />
                                            <small style={{ color: "#799285", fontSize: "11px", marginTop: "4px", display: "block" }}>
                                                Pack size or weight (e.g. 500 Gram, 60 Capsules)
                                            </small>

                                        </div>


                                        <div className="field price-preview full">

                                            <label>
                                                Final Price & Discount Calculation
                                            </label>

                                            <div className="pricing-calculation-card">
                                                <div className="calc-row">
                                                    <span>Original Price (MRP):</span>
                                                    <strong>₹{pricing.base || 0}</strong>
                                                </div>
                                                <div className="calc-row discount-row">
                                                    <span>Discount ({form.discountType}):</span>
                                                    <strong className="text-green">
                                                        {pricing.offAmount > 0
                                                            ? `- ₹${pricing.offAmount} (${pricing.discountTag})`
                                                            : "₹0 (No Discount)"}
                                                    </strong>
                                                </div>
                                                <div className="calc-divider"></div>
                                                <div className="calc-row final-row">
                                                    <span>Final Selling Price (Customer Pays):</span>
                                                    <strong className="text-gold">₹{pricing.sellingPrice}</strong>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                STEP 3
                            ================================================= */}

                            {step === 3 && (

                                <div className="step-content">

                                    <div className="step-title">
                                        <span>STEP 03</span>
                                        <h3>Product Content</h3>
                                        <p>
                                            Add images, benefits,
                                            ingredients, usage and FAQ.
                                        </p>
                                    </div>


                                    {/* ======================
                                        IMAGES
                                    ====================== */}

                                    <div className="content-section">

                                        <div className="section-heading">

                                            <div>
                                                <h4>
                                                    Product Images
                                                </h4>

                                                <p>
                                                    Upload up to 10 product
                                                    images.
                                                </p>
                                            </div>

                                            <span>
                                                {images.length}/10
                                            </span>

                                        </div>


                                        <label className="image-upload-box">

                                            <FiUpload />

                                            <strong>
                                                Upload Product Images
                                            </strong>

                                            <span>
                                                PNG, JPG or WEBP
                                            </span>

                                            <small>
                                                Maximum 10 images
                                            </small>

                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                multiple
                                                onChange={handleImages}
                                            />

                                        </label>


                                        {images.length > 0 && (

                                            <div className="image-preview-grid">

                                                {images.map(
                                                    (image, index) => (

                                                        <div
                                                            className="image-preview"
                                                            key={index}
                                                        >

                                                            <img
                                                                src={
                                                                    image.url
                                                                }
                                                                alt={`Product ${index + 1}`}
                                                            />

                                                            <span>
                                                                {index + 1}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeImage(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <FiX />
                                                            </button>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>


                                    {/* ======================
                                        BENEFITS
                                    ====================== */}

                                    <div className="content-section">

                                        <div className="section-heading">

                                            <div>
                                                <h4>
                                                    Benefits
                                                </h4>

                                                <p>
                                                    Add product benefits.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="small-add"
                                                onClick={addBenefit}
                                            >
                                                + Add Benefit
                                            </button>

                                        </div>


                                        <div className="dynamic-list">

                                            {form.benefits.map(
                                                (benefit, index) => (

                                                    <div
                                                        className="dynamic-row"
                                                        key={index}
                                                    >

                                                        <span>
                                                            {index + 1}
                                                        </span>

                                                        <input
                                                            className="input"
                                                            value={benefit}
                                                            onChange={(e) =>
                                                                updateBenefit(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter product benefit"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeBenefit(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FiTrash2 />
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>


                                    {/* ======================
                                        INGREDIENTS
                                    ====================== */}

                                    <div className="content-section">

                                        <div className="section-heading">

                                            <div>
                                                <h4>
                                                    Ingredients
                                                </h4>

                                                <p>
                                                    Add product ingredients.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="small-add"
                                                onClick={addIngredient}
                                            >
                                                + Add Ingredient
                                            </button>

                                        </div>


                                        <div className="dynamic-list">

                                            {form.ingredients.map(
                                                (ingredient, index) => (

                                                    <div
                                                        className="dynamic-row"
                                                        key={index}
                                                    >

                                                        <span>
                                                            {index + 1}
                                                        </span>

                                                        <input
                                                            className="input"
                                                            value={
                                                                ingredient
                                                            }
                                                            onChange={(e) =>
                                                                updateIngredient(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter ingredient"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeIngredient(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FiTrash2 />
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>


                                    {/* ======================
                                        HOW TO USE
                                    ====================== */}

                                    <div className="content-section">

                                        <div className="section-heading">
                                            <div>
                                                <h4>
                                                    How To Use
                                                </h4>

                                                <p>
                                                    Explain how customers
                                                    should use this product.
                                                </p>
                                            </div>
                                        </div>

                                        <textarea
                                            className="input textarea"
                                            rows="6"
                                            value={form.howToUse}
                                            onChange={(e) =>
                                                updateForm(
                                                    "howToUse",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: Take 1 teaspoon daily with warm water..."
                                        />

                                    </div>


                                    {/* ======================
                                        FAQ
                                    ====================== */}

                                    <div className="content-section">

                                        <div className="section-heading">

                                            <div>
                                                <h4>
                                                    Frequently Asked Questions
                                                </h4>

                                                <p>
                                                    Add common customer
                                                    questions and answers.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="small-add"
                                                onClick={addFaq}
                                            >
                                                + Add FAQ
                                            </button>

                                        </div>


                                        <div className="faq-list">

                                            {form.faq.map(
                                                (faq, index) => (

                                                    <div
                                                        className="faq-item"
                                                        key={index}
                                                    >

                                                        <div className="faq-number">
                                                            FAQ {index + 1}
                                                        </div>

                                                        <div className="faq-grid">

                                                            <input
                                                                className="input"
                                                                value={
                                                                    faq.question
                                                                }
                                                                onChange={(e) =>
                                                                    updateFaq(
                                                                        index,
                                                                        "question",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Question"
                                                            />

                                                            <textarea
                                                                className="input textarea"
                                                                rows="3"
                                                                value={
                                                                    faq.answer
                                                                }
                                                                onChange={(e) =>
                                                                    updateFaq(
                                                                        index,
                                                                        "answer",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Answer"
                                                            />

                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="faq-delete"
                                                            onClick={() =>
                                                                removeFaq(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FiTrash2 />
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                STEP 4
                            ================================================= */}

                            {step === 4 && (

                                <div className="step-content">

                                    <div className="step-title">
                                        <span>STEP 04</span>
                                        <h3>SEO Information</h3>
                                        <p>
                                            Optimize your product for
                                            search engines.
                                        </p>
                                    </div>


                                    <div className="form-grid">

                                        <div className="field full">

                                            <label>
                                                Meta Title
                                            </label>

                                            <input
                                                className="input"
                                                value={form.metaTitle}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "metaTitle",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter SEO meta title"
                                            />

                                            <small className="field-help">
                                                Recommended: 50–60
                                                characters.
                                            </small>

                                        </div>


                                        <div className="field full">

                                            <label>
                                                Meta Description
                                            </label>

                                            <textarea
                                                className="input textarea"
                                                rows="5"
                                                value={
                                                    form.metaDescription
                                                }
                                                onChange={(e) =>
                                                    updateForm(
                                                        "metaDescription",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter SEO meta description"
                                            />

                                            <small className="field-help">
                                                Recommended: 140–160
                                                characters.
                                            </small>

                                        </div>


                                        <div className="field full">

                                            <label>
                                                Meta Tags
                                            </label>

                                            <input
                                                className="input"
                                                value={form.metaTags}
                                                onChange={(e) =>
                                                    updateForm(
                                                        "metaTags",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="ashwagandha, herbal, ayurvedic, immunity"
                                            />

                                            <small className="field-help">
                                                Separate tags with commas.
                                            </small>

                                        </div>

                                    </div>


                                    {/* =========================
                                        FINAL SUMMARY
                                    ========================= */}

                                    <div className="product-summary">

                                        <div className="summary-header">
                                            <h4>
                                                Product Summary
                                            </h4>

                                            <FiCheck />
                                        </div>

                                        <div className="summary-grid">

                                            <div>
                                                <span>
                                                    Product
                                                </span>

                                                <strong>
                                                    {form.productName ||
                                                        "Not added"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Category
                                                </span>

                                                <strong>
                                                    {form.category ||
                                                        "Not selected"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Base (MRP)
                                                </span>

                                                <strong>
                                                    ₹{pricing.base}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Discount
                                                </span>

                                                <strong style={{ color: pricing.offAmount > 0 ? "#22c55e" : "inherit" }}>
                                                    {pricing.offAmount > 0 ? pricing.discountTag : "None"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Selling Price
                                                </span>

                                                <strong style={{ color: "#d8b56a" }}>
                                                    ₹{pricing.sellingPrice}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Status
                                                </span>

                                                <strong>
                                                    {form.active
                                                        ? "Active"
                                                        : "Draft"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Images
                                                </span>

                                                <strong>
                                                    {images.length}/10
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Unit
                                                </span>

                                                <strong>
                                                    {form.unit}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Stock Quantity
                                                </span>

                                                <strong style={{ color: "#86efac" }}>
                                                    {form.stock !== "" && form.stock !== undefined ? form.stock : 100} Units
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Net Measure
                                                </span>

                                                <strong>
                                                    {form.weight ? `${form.weight} ${form.unit}` : form.unit}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =========================
                                FOOTER BUTTONS
                            ========================= */}

                            <div className="product-modal-footer">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        step === 1
                                            ? closePopup
                                            : previousStep
                                    }
                                >
                                    {step === 1 ? (
                                        <>
                                            <FiX />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <FiChevronLeft />
                                            Previous
                                        </>
                                    )}
                                </button>


                                <div className="step-counter">
                                    Step {step} of 4
                                </div>


                                {step < 4 ? (

                                    <button
                                        key="btn-wizard-next"
                                        type="button"
                                        className="btn next-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            nextStep();
                                        }}
                                    >
                                        Next
                                        <FiChevronRight />
                                    </button>

                                ) : (

                                    <button
                                        key="btn-wizard-save"
                                        type="button"
                                        className="btn save-product-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSubmit(e);
                                        }}
                                        disabled={submitting}
                                        style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                                    >
                                        <FiCheck />
                                        {submitting
                                            ? "Saving..."
                                            : editingProduct
                                            ? "Update Product"
                                            : "Save Product"}
                                    </button>

                                )}

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </AdminShell>
    );
}