import React, { useState } from "react";
import AdminShell from "../../components/AdminShell";
import {
    FiPlus,
    FiX,
    FiUpload,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiGrid,
    FiCheck,
} from "react-icons/fi";
import "./AdminCategories.css";

export default function AdminCategories() {

    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");

    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);
    const [active, setActive] = useState(true);

    const [categories, setCategories] = useState([
        {
            id: 1,
            name: "Immunity Boosters",
            products: 12,
            status: "Active",
            image: "/assets/category-immunity.jpg",
        },
        {
            id: 2,
            name: "Skin Care",
            products: 10,
            status: "Active",
            image: "/assets/category-skincare.jpg",
        },
        {
            id: 3,
            name: "Hair Care",
            products: 8,
            status: "Active",
            image: "/assets/category-haircare.jpg",
        },
        {
            id: 4,
            name: "Digestive Health",
            products: 9,
            status: "Active",
            image: "/assets/category-digestive.jpg",
        },
        {
            id: 5,
            name: "Herbal Teas",
            products: 6,
            status: "Active",
            image: "/assets/category-teas.jpg",
        },
        {
            id: 6,
            name: "Wellness Packs",
            products: 5,
            status: "Draft",
            image: "/assets/category-wellness.jpg",
        },
    ]);


    /* ==========================================
       IMAGE UPLOAD
    ========================================== */

    const handleImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setCategoryImage({
            file,
            url: imageUrl,
        });
    };


    /* ==========================================
       RESET FORM
    ========================================== */

    const resetForm = () => {

        setCategoryName("");
        setCategoryImage(null);
        setActive(true);
    };


    /* ==========================================
       CLOSE MODAL
    ========================================== */

    const closeModal = () => {

        setShow(false);
        resetForm();
    };


    /* ==========================================
       SAVE CATEGORY
    ========================================== */

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!categoryName.trim()) {
            alert("Please enter category name.");
            return;
        }

        if (!categoryImage) {
            alert("Please upload category image.");
            return;
        }


        const newCategory = {
            id: Date.now(),
            name: categoryName,
            products: 0,
            status: active ? "Active" : "Draft",
            image: categoryImage.url,
        };


        setCategories((prev) => [
            newCategory,
            ...prev,
        ]);

        closeModal();

    };


    /* ==========================================
       DELETE CATEGORY
    ========================================== */

    const deleteCategory = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        setCategories((prev) =>
            prev.filter((category) => category.id !== id)
        );
    };


    /* ==========================================
       SEARCH
    ========================================== */

    const filteredCategories = categories.filter(
        (category) =>
            `${category.name} ${category.status}`
                .toLowerCase()
                .includes(search.toLowerCase())
    );


    return (

        <AdminShell>

            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="category-head">

                <div>

                    <span className="category-eyebrow">
                        Admin Management
                    </span>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Create and manage product categories
                        with images and status.
                    </p>

                </div>


                <button
                    className="category-add-btn"
                    onClick={() => setShow(true)}
                >
                    <FiPlus />
                    Add Category
                </button>

            </div>


            {/* ==========================================
                TOOLBAR
            ========================================== */}

            <div className="category-toolbar">

                <div className="category-search">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <select className="category-filter">

                    <option>
                        All Status
                    </option>

                    <option>
                        Active
                    </option>

                    <option>
                        Draft
                    </option>

                </select>

            </div>


            {/* ==========================================
                CATEGORY COUNT
            ========================================== */}

            <div className="category-info">

                <div className="category-info-icon">
                    <FiGrid />
                </div>

                <div>
                    <strong>
                        {filteredCategories.length}
                    </strong>

                    <span>
                        Total Categories
                    </span>
                </div>

            </div>


            {/* ==========================================
                CATEGORY GRID
            ========================================== */}

            <div className="category-grid">

                {filteredCategories.map((category) => (

                    <div
                        className="category-card"
                        key={category.id}
                    >

                        {/* Image */}

                        <div className="category-image">

                            <img
                                src={category.image}
                                alt={category.name}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/assets/category-placeholder.jpg";
                                }}
                            />


                            <span
                                className={
                                    category.status === "Active"
                                        ? "category-status active"
                                        : "category-status draft"
                                }
                            >
                                {category.status}
                            </span>


                            <div className="category-image-overlay">

                                <button
                                    title="Edit Category"
                                >
                                    <FiEdit2 />
                                </button>

                                <button
                                    className="delete"
                                    title="Delete Category"
                                    onClick={() =>
                                        deleteCategory(
                                            category.id
                                        )
                                    }
                                >
                                    <FiTrash2 />
                                </button>

                            </div>

                        </div>


                        {/* Content */}

                        <div className="category-card-content">

                            <div>

                                <h3>
                                    {category.name}
                                </h3>

                                <p>
                                    {category.products} Products
                                </p>

                            </div>


                            <div className="category-card-footer">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    #{String(category.id).slice(-4)}
                                </strong>

                            </div>

                        </div>

                    </div>

                ))}


                {/* Empty State */}

                {filteredCategories.length === 0 && (

                    <div className="category-empty">

                        <FiGrid />

                        <h3>
                            No Categories Found
                        </h3>

                        <p>
                            Try another search or create
                            a new category.
                        </p>

                    </div>

                )}

            </div>


            {/* =====================================================
                ADD CATEGORY MODAL
            ===================================================== */}

            {show && (

                <div className="category-modal-overlay">

                    <div className="category-modal">


                        {/* Modal Header */}

                        <div className="category-modal-header">

                            <div>

                                <span>
                                    CATEGORY MANAGEMENT
                                </span>

                                <h2>
                                    Add New Category
                                </h2>

                                <p>
                                    Create a category with
                                    its image and status.
                                </p>

                            </div>


                            <button
                                className="category-modal-close"
                                onClick={closeModal}
                            >
                                <FiX />
                            </button>

                        </div>


                        {/* Form */}

                        <form
                            className="category-form"
                            onSubmit={handleSubmit}
                        >


                            {/* Category Name */}

                            <div className="category-field">

                                <label>
                                    Category Name
                                    <span>*</span>
                                </label>

                                <input
                                    className="category-input"
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) =>
                                        setCategoryName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter category name"
                                />

                            </div>


                            {/* Status */}

                            <div className="category-field">

                                <label>
                                    Category Status
                                </label>


                                <div className="category-toggle-box">

                                    <button
                                        type="button"
                                        className={
                                            active
                                                ? "category-switch active"
                                                : "category-switch"
                                        }
                                        onClick={() =>
                                            setActive(
                                                !active
                                            )
                                        }
                                    >
                                        <span></span>
                                    </button>


                                    <div>

                                        <strong>
                                            {active
                                                ? "Active"
                                                : "Draft"}
                                        </strong>

                                        <small>
                                            {active
                                                ? "Category will be visible"
                                                : "Category will remain hidden"}
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Image Upload */}

                            <div className="category-field">

                                <label>
                                    Category Image
                                    <span>*</span>
                                </label>


                                {!categoryImage ? (

                                    <label className="category-upload">

                                        <FiUpload />

                                        <strong>
                                            Upload Category Image
                                        </strong>

                                        <span>
                                            Click to browse image
                                        </span>

                                        <small>
                                            JPG, PNG or WEBP
                                        </small>

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={
                                                handleImageChange
                                            }
                                        />

                                    </label>

                                ) : (

                                    <div className="category-preview">

                                        <img
                                            src={
                                                categoryImage.url
                                            }
                                            alt="Category Preview"
                                        />


                                        <div className="category-preview-overlay">

                                            <strong>
                                                Category Preview
                                            </strong>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCategoryImage(
                                                        null
                                                    )
                                                }
                                            >
                                                <FiX />
                                                Remove Image
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* Preview Name */}

                            <div className="category-live-preview">

                                <span>
                                    LIVE PREVIEW
                                </span>

                                <div>

                                    {categoryImage ? (

                                        <img
                                            src={
                                                categoryImage.url
                                            }
                                            alt=""
                                        />

                                    ) : (

                                        <div className="preview-placeholder">
                                            <FiGrid />
                                        </div>

                                    )}


                                    <div>

                                        <strong>
                                            {categoryName ||
                                                "Category Name"}
                                        </strong>

                                        <small>
                                            0 Products
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Buttons */}

                            <div className="category-form-actions">

                                <button
                                    type="button"
                                    className="category-cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="category-save-btn"
                                >
                                    <FiCheck />
                                    Save Category
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </AdminShell>
    );
}