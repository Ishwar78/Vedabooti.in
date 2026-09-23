import React, { useState } from "react";
import AdminShell from "../../components/AdminShell";
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
} from "react-icons/fi";
import "./AdminProducts.css";

export default function AdminProducts() {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [step, setStep] = useState(1);

    const [products, setProducts] = useState([
        {
            name: "Ashwagandha Powder",
            category: "Immunity",
            price: "₹299",
            status: "Active",
        },
        {
            name: "Amla Powder",
            category: "Nutrition",
            price: "₹249",
            status: "Active",
        },
        {
            name: "Tulsi Leaves",
            category: "Immunity",
            price: "₹199",
            status: "Active",
        },
        {
            name: "Neem Powder",
            category: "Skin Care",
            price: "₹249",
            status: "Active",
        },
        {
            name: "Triphala Churna",
            category: "Digestive",
            price: "₹299",
            status: "Active",
        },
        {
            name: "Brahmi Powder",
            category: "Mind & Focus",
            price: "₹249",
            status: "Draft",
        },
    ]);

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

    const categories = [
        "Skin Care",
        "Hair Care",
        "Health & Wellness",
        "Immunity Boost",
        "Herbal Teas",
        "Nutrition",
        "Digestive",
        "Mind & Focus",
        "Ayurvedic",
    ];

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
       IMAGE UPLOAD
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

            if (updated[index]?.url) {
                URL.revokeObjectURL(updated[index].url);
            }

            updated.splice(index, 1);

            return updated;
        });
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
       SAVE PRODUCT
    ========================= */

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            name: form.productName,
            category: form.category,
            price: `₹${form.price}`,
            status: form.active ? "Active" : "Draft",
        };

        setProducts((prev) => [newProduct, ...prev]);

        alert("Product added successfully.");

        closePopup();
    };

    /* =========================
       FILTER
    ========================= */

    const filteredProducts = products.filter((product) =>
        `${product.name} ${product.category} ${product.price} ${product.status}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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

                <button
                    className="btn add-product-btn"
                    onClick={() => setShow(true)}
                >
                    <FiPlus />
                    Add New
                </button>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="crud-toolbar">

                <input
                    className="input"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select className="select">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Draft</option>
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
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {filteredProducts.map((product, index) => (

                    <div
                        className="table-row"
                        key={index}
                    >

                        <span className="product-name-cell">
                            {product.name}
                        </span>

                        <span>
                            {product.category}
                        </span>

                        <span>
                            {product.price}
                        </span>

                        <span>
                            <span
                                className={
                                    product.status === "Active"
                                        ? "status active"
                                        : "status draft"
                                }
                            >
                                {product.status}
                            </span>
                        </span>

                        <div className="row-actions">

                            <button title="View">
                                <FiEye />
                            </button>

                            <button title="Edit">
                                <FiEdit2 />
                            </button>

                            <button
                                className="delete-action"
                                title="Delete"
                            >
                                <FiTrash2 />
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            {/* =====================================================
                ADD PRODUCT MODAL
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
                                    Add New Product
                                </h2>

                                <p>
                                    Create and publish a new
                                    product.
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
                            onSubmit={handleSubmit}
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

                                            <textarea
                                                className="input textarea"
                                                rows="3"
                                                value={
                                                    form.shortDescription
                                                }
                                                onChange={(e) =>
                                                    updateForm(
                                                        "shortDescription",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Write a short product description..."
                                            />

                                        </div>


                                        <div className="field full">

                                            <label>
                                                Full Description
                                            </label>

                                            <textarea
                                                className="input textarea"
                                                rows="6"
                                                value={
                                                    form.description
                                                }
                                                onChange={(e) =>
                                                    updateForm(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Write complete product description..."
                                            />

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
                                                Product Weight / Quantity
                                            </label>

                                            <input
                                                className="input"
                                                type="number"
                                                placeholder="500"
                                            />

                                        </div>


                                        <div className="field price-preview">

                                            <label>
                                                Final Price Preview
                                            </label>

                                            <div className="price-preview-box">

                                                <span>
                                                    Selling Price
                                                </span>

                                                <strong>
                                                    ₹
                                                    {form.price || "0"}
                                                </strong>

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
                                                    Price
                                                </span>

                                                <strong>
                                                    ₹
                                                    {form.price || "0"}
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
                                        type="button"
                                        className="btn next-btn"
                                        onClick={nextStep}
                                    >
                                        Next
                                        <FiChevronRight />
                                    </button>

                                ) : (

                                    <button
                                        type="submit"
                                        className="btn save-product-btn"
                                    >
                                        <FiCheck />
                                        Save Product
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