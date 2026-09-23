import React, { useState } from "react";
import UserShell from "../../components/UserShell";
import { FiPlus, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import "./Addresses.css";

const defaultAddresses = [
  {
    id: 1,
    tag: "HOME (DEFAULT)",
    name: "Wellness Lover",
    line1: "24 Green Avenue, Sector 14",
    city: "Rohtak",
    state: "Haryana",
    pincode: "124001",
    phone: "+91 98765 43210"
  },
  {
    id: 2,
    tag: "OFFICE",
    name: "Veda Booti Store",
    line1: "15 Herbal Market, DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001",
    phone: "+91 98765 11111"
  }
];

export default function Addresses() {
  const [addresses, setAddresses] = useState(defaultAddresses);
  const [showAdd, setShowAdd] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: "HOME",
    name: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setAddresses((prev) => [
      ...prev,
      {
        ...newAddr,
        id: Date.now()
      }
    ]);
    setShowAdd(false);
    setNewAddr({
      tag: "HOME",
      name: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      phone: ""
    });
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <UserShell>
      <div className="addresses-section">
        <div className="addresses-top">
          <div>
            <span className="eyebrow">Delivery Locations</span>
            <h1>Saved Addresses ({addresses.length})</h1>
            <p className="account-sub">
              Manage your delivery addresses for quick and hassle-free checkout.
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setShowAdd((v) => !v)}
          >
            <FiPlus /> {showAdd ? "Close Form" : "Add New Address"}
          </button>
        </div>

        {showAdd && (
          <form className="add-address-form" onSubmit={handleAddSubmit}>
            <h3>Add New Delivery Address</h3>
            <div className="addr-form-grid">
              <input
                className="input"
                placeholder="Full Name *"
                value={newAddr.name}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, name: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Phone Number *"
                value={newAddr.phone}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, phone: e.target.value })
                }
                required
              />
              <input
                className="input wide"
                placeholder="Address (House/Flat No., Street, Landmark) *"
                value={newAddr.line1}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, line1: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="City *"
                value={newAddr.city}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, city: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="State *"
                value={newAddr.state}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, state: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Pincode *"
                value={newAddr.pincode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, pincode: e.target.value })
                }
                required
              />
            </div>
            <button className="btn" type="submit">
              Save Address
            </button>
          </form>
        )}

        <div className="address-grid">
          {addresses.map((addr) => (
            <article className="address-card" key={addr.id}>
              <div className="address-badge-row">
                <span className="addr-tag">{addr.tag}</span>
                <button
                  type="button"
                  className="addr-delete-btn"
                  onClick={() => handleDelete(addr.id)}
                  title="Delete address"
                >
                  <FiTrash2 />
                </button>
              </div>
              <h3>{addr.name}</h3>
              <p>
                {addr.line1}
                <br />
                {addr.city}, {addr.state} — {addr.pincode}
                <br />
                Phone: {addr.phone}
              </p>
            </article>
          ))}
        </div>
      </div>
    </UserShell>
  );
}
