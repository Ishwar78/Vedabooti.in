// Shared Cart & Wishlist Storage Helper with Backend Sync & Robust Identity Matching
import { API_BASE_URL } from "./api";

export const STORAGE_UPDATE_EVENT = "vb_storage_update";

export function dispatchStorageUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STORAGE_UPDATE_EVENT));
  }
}

export function subscribeToStorage(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(STORAGE_UPDATE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(STORAGE_UPDATE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// ================= PRODUCT IDENTITY HELPERS =================

export function isSameProduct(a, b) {
  if (!a || !b) return false;
  const aId = a._id || a.id;
  const bId = b._id || b.id;

  // Strict check on ID: must be non-empty string or valid number
  if (aId !== undefined && aId !== null && bId !== undefined && bId !== null) {
    const sA = String(aId).trim();
    const sB = String(bId).trim();
    if (sA !== "" && sB !== "" && sA === sB) return true;
  }

  // Strict check on slug: must be non-empty string
  if (a.slug && b.slug) {
    const sA = String(a.slug).trim();
    const sB = String(b.slug).trim();
    if (sA !== "" && sB !== "" && sA === sB) return true;
  }

  return false;
}

export function matchesIdentifier(item, idOrSlug) {
  if (!item || idOrSlug === undefined || idOrSlug === null) return false;
  const target = String(idOrSlug).trim();
  if (!target) return false;

  const itemId = item._id || item.id;
  if (itemId !== undefined && itemId !== null && String(itemId).trim() === target) {
    return true;
  }

  if (item.slug && String(item.slug).trim() === target) {
    return true;
  }

  return false;
}

// ================= BACKEND CART PERSISTENCE =================

export async function syncCartToBackend(cartItems) {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");
  if (!token) return;

  try {
    const items = cartItems || getCart();
    await fetch(`${API_BASE_URL}/api/auth/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart: items }),
    });
  } catch (err) {
    console.warn("[Cart Sync] Failed to sync cart with account:", err);
  }
}

export function mergeAndRestoreUserCart(serverCart = []) {
  if (typeof window === "undefined") return [];
  const localCart = getCart();
  const merged = Array.isArray(serverCart) ? [...serverCart] : [];

  if (Array.isArray(localCart)) {
    localCart.forEach((localItem) => {
      const exists = merged.find((item) => isSameProduct(item, localItem));
      if (exists) {
        exists.qty = Math.max(Number(exists.qty) || 1, Number(localItem.qty) || 1);
      } else {
        merged.push(localItem);
      }
    });
  }

  localStorage.setItem("vb_cart", JSON.stringify(merged));
  dispatchStorageUpdate();
  syncCartToBackend(merged);
  return merged;
}

export async function restoreUserCartFromBackend() {
  if (typeof window === "undefined") return [];
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");
  if (!token) return getCart();

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data.cart)) {
      return mergeAndRestoreUserCart(data.cart);
    }
  } catch {
    // silently fallback to localStorage
  }
  return getCart();
}

// ================= CART FUNCTIONS =================

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("vb_cart") || "[]");
  } catch {
    return [];
  }
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (Number(item.qty) || 1), 0);
}

export function addToCart(product, qty = 1) {
  if (!product) return getCart();
  const cart = getCart();
  const numQty = Number(qty) > 0 ? Number(qty) : 1;

  const index = cart.findIndex((item) => isSameProduct(item, product));

  if (index !== -1) {
    cart[index].qty = (Number(cart[index].qty) || 1) + numQty;
  } else {
    cart.push({
      ...product,
      id: product._id || product.id,
      _id: product._id || product.id,
      qty: numQty,
    });
  }

  localStorage.setItem("vb_cart", JSON.stringify(cart));
  dispatchStorageUpdate();
  syncCartToBackend(cart);
  return cart;
}

export function updateCartQty(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    const newQty = (Number(cart[index].qty) || 1) + delta;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    localStorage.setItem("vb_cart", JSON.stringify(cart));
    dispatchStorageUpdate();
    syncCartToBackend(cart);
  }
  return cart;
}

export function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem("vb_cart", JSON.stringify(cart));
    dispatchStorageUpdate();
    syncCartToBackend(cart);
  }
  return cart;
}

export function clearCart() {
  localStorage.removeItem("vb_cart");
  dispatchStorageUpdate();
  syncCartToBackend([]);
}

// ================= DIRECT CHECKOUT ITEM =================

export function setDirectCheckoutItem(item) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("vb_direct_checkout", JSON.stringify(item));
  }
}

export function getDirectCheckoutItem() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("vb_direct_checkout");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDirectCheckoutItem() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("vb_direct_checkout");
  }
}

// ================= WISHLIST FUNCTIONS =================

export function getWishlist() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("vb_wishlist") || "[]");
  } catch {
    return [];
  }
}

export function getWishlistCount() {
  return getWishlist().length;
}

export function isInWishlist(productIdOrSlug) {
  if (!productIdOrSlug) return false;
  const list = getWishlist();
  return list.some((item) => matchesIdentifier(item, productIdOrSlug));
}

export function toggleWishlist(product) {
  if (!product) return { list: getWishlist(), added: false };
  const list = getWishlist();
  const index = list.findIndex((item) => isSameProduct(item, product));

  let added = false;
  if (index !== -1) {
    list.splice(index, 1);
    added = false;
  } else {
    list.push({
      ...product,
      id: product._id || product.id,
      _id: product._id || product.id,
    });
    added = true;
  }

  localStorage.setItem("vb_wishlist", JSON.stringify(list));
  dispatchStorageUpdate();
  return { list, added };
}

export function removeFromWishlist(productIdOrSlug) {
  if (!productIdOrSlug) return getWishlist();
  const list = getWishlist();
  const filtered = list.filter((item) => !matchesIdentifier(item, productIdOrSlug));
  localStorage.setItem("vb_wishlist", JSON.stringify(filtered));
  dispatchStorageUpdate();
  return filtered;
}
