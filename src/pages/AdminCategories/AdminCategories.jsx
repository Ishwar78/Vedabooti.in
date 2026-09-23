import React, { useState, useEffect } from "react";
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
    FiLoader,
} from "react-icons/fi";
import api, { getCategoryImageUrl } from "../../lib/api";
import "./AdminCategories.css";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [show, setShow] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const [categoryName, setCategoryName] = useState("");
    const [categorySubtitle, setCategorySubtitle] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);
    const [active, setActive] = useState(true);

    // Fetch categories from backend
    const fetchCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/api/categories");
            if (res && res.categories) {
                setCategories(res.categories);
            } else if (Array.isArray(res)) {
                setCategories(res);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* ==========================================
       IMAGE UPLOAD
    ========================================== */
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file (JPG, PNG, WEBP).");
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setCategoryImage({
            file,
            url: imageUrl,
        });
    };

    /* ==========================================
       RESET & MODAL CONTROLS
    ========================================== */
    const resetForm = () => {
        setCategoryName("");
        setCategorySubtitle("");
        setCategoryDescription("");
        setCategoryImage(null);
        setActive(true);
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShow(true);
    };

    const openEditModal = (category) => {
        setEditingId(category._id);
        setCategoryName(category.name || "");
        setCategorySubtitle(category.subtitle || "");
        setCategoryDescription(category.description || "");
        setActive(category.status === "Active");

        if (category.image) {
            setCategoryImage({
                file: null,
                url: getCategoryImageUrl(category.image),
                raw: category.image,
            });
        } else {
            setCategoryImage(null);
        }

        setShow(true);
    };

    const closeModal = () => {
        setShow(false);
        resetForm();
    };

    /* ==========================================
       SAVE / UPDATE CATEGORY
    ========================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            alert("Please enter category name.");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", categoryName.trim());
            formData.append("subtitle", categorySubtitle.trim());
            formData.append("description", categoryDescription.trim());
            formData.append("status", active ? "Active" : "Draft");

            if (categoryImage?.file) {
                formData.append("image", categoryImage.file);
            } else if (categoryImage?.raw) {
                formData.append("image", categoryImage.raw);
            }

            if (editingId) {
                await api.put(`/api/categories/${editingId}`, formData);
            } else {
                await api.post("/api/categories", formData);
            }

            await fetchCategories();
            closeModal();
        } catch (err) {
            console.error("Error saving category:", err);
            alert(err.message || "Failed to save category.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ==========================================
       DELETE CATEGORY
    ========================================== */
    const deleteCategory = async (id, name) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${name || "this category"}"?`
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/api/categories/${id}`);
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
        } catch (err) {
            console.error("Error deleting category:", err);
            alert(err.message || "Failed to delete category.");
        }
    };

    /* ==========================================
       SEARCH & FILTER
    ========================================== */
    const filteredCategories = categories.filter((category) => {
        const matchesSearch =
            `${category.name} ${category.subtitle || ""} ${category.status}`
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All Status" || category.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminShell>
            {/* ==========================================
                PAGE HEADER
            ========================================== */}
            <div className="category-head">
                <div>
                    <span className="category-eyebrow">Admin Management</span>
                    <h1>Categories</h1>
                    <p>
                        Create, edit, and manage store categories stored in the database.
                    </p>
                </div>

                <button className="category-add-btn" onClick={openAddModal}>
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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="category-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                </select>
            </div>

            {/* ==========================================
                CATEGORY COUNT / STATUS
            ========================================== */}
            <div className="category-info">
                <div className="category-info-icon">
                    <FiGrid />
                </div>
                <div>
                    <strong>{filteredCategories.length}</strong>
                    <span>Total Categories in Database</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div
                    style={{
                        padding: "12px 16px",
                        background: "rgba(220, 38, 38, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                        borderRadius: "8px",
                        marginBottom: "18px",
                        fontSize: "14px",
                    }}
                >
                    {error}
                </div>
            )}

            {/* ==========================================
                CATEGORY GRID
            ========================================== */}
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "60px 20px",
                        color: "#839188",
                        gap: "10px",
                        fontSize: "16px",
                    }}
                >
                    <FiLoader className="spin" style={{ fontSize: "22px" }} />
                    <span>Loading categories from database...</span>
                </div>
            ) : (
                <div className="category-grid">
                    {filteredCategories.map((category) => (
                        <div className="category-card" key={category._id}>
                            {/* Image */}
                            <div className="category-image">
                                <img
                                    src={getCategoryImageUrl(category.image)}
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
                                        onClick={() => openEditModal(category)}
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        className="delete"
                                        title="Delete Category"
                                        onClick={() =>
                                            deleteCategory(category._id, category.name)
                                        }
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="category-card-content">
                                <div>
                                    <h3>{category.name}</h3>
                                    <p>
                                        {category.subtitle ||
                                            `${category.productsCount || 0} Products`}
                                    </p>
                                </div>

                                <div className="category-card-footer">
                                    <span>Category</span>
                                    <strong>
                                        #{String(category._id).slice(-4).toUpperCase()}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredCategories.length === 0 && (
                        <div className="category-empty">
                            <FiGrid />
                            <h3>No Categories Found</h3>
                            <p>
                                Click the "Add Category" button above to create your first category.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* =====================================================
                ADD / EDIT CATEGORY MODAL
            ===================================================== */}
            {show && (
                <div className="category-modal-overlay">
                    <div className="category-modal">
                        {/* Modal Header */}
                        <div className="category-modal-header">
                            <div>
                                <span>CATEGORY MANAGEMENT</span>
                                <h2>
                                    {editingId ? "Edit Category" : "Add New Category"}
                                </h2>
                                <p>
                                    {editingId
                                        ? "Update category details, image, or visibility status."
                                        : "Create a category with its image and status."}
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
                        <form className="category-form" onSubmit={handleSubmit}>
                            {/* Category Name */}
                            <div className="category-field">
                                <label>
                                    Category Name <span>*</span>
                                </label>
                                <input
                                    className="category-input"
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g. Immunity Boosters, Skin Care"
                                />
                            </div>

                            {/* Subtitle */}
                            <div className="category-field">
                                <label>Subtitle / Goal</label>
                                <input
                                    className="category-input"
                                    type="text"
                                    value={categorySubtitle}
                                    onChange={(e) => setCategorySubtitle(e.target.value)}
                                    placeholder="e.g. Strengthen your everyday wellness"
                                />
                            </div>

                            {/* Description */}
                            <div className="category-field">
                                <label>Description</label>
                                <textarea
                                    className="category-input"
                                    rows="2"
                                    style={{ height: "auto", padding: "10px 13px" }}
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    placeholder="Short description for the categories page..."
                                />
                            </div>

                            {/* Status */}
                            <div className="category-field">
                                <label>Category Status</label>
                                <div className="category-toggle-box">
                                    <button
                                        type="button"
                                        className={
                                            active
                                                ? "category-switch active"
                                                : "category-switch"
                                        }
                                        onClick={() => setActive(!active)}
                                    >
                                        <span></span>
                                    </button>

                                    <div>
                                        <strong>{active ? "Active" : "Draft"}</strong>
                                        <small>
                                            {active
                                                ? "Category will be visible on storefront"
                                                : "Category will remain hidden"}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="category-field">
                                <label>Category Image</label>

                                {!categoryImage ? (
                                    <label className="category-upload">
                                        <FiUpload />
                                        <strong>Upload Category Image</strong>
                                        <span>Click to browse image</span>
                                        <small>JPG, PNG or WEBP</small>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                ) : (
                                    <div className="category-preview">
                                        <img
                                            src={categoryImage.url}
                                            alt="Category Preview"
                                        />

                                        <div className="category-preview-overlay">
                                            <strong>Category Image Selected</strong>
                                            <button
                                                type="button"
                                                onClick={() => setCategoryImage(null)}
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
                                <span>LIVE PREVIEW</span>
                                <div>
                                    {categoryImage ? (
                                        <img src={categoryImage.url} alt="" />
                                    ) : (
                                        <div className="preview-placeholder">
                                            <FiGrid />
                                        </div>
                                    )}

                                    <div>
                                        <strong>
                                            {categoryName || "Category Name"}
                                        </strong>
                                        <small>
                                            {categorySubtitle || "0 Products"}
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
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="category-save-btn"
                                    disabled={submitting}
                                >
                                    <FiCheck />
                                    {submitting
                                        ? "Saving..."
                                        : editingId
                                        ? "Update Category"
                                        : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}