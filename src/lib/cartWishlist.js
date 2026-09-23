// Shared Cart & Wishlist Storage Helper

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
  const cart = getCart();
  const index = cart.findIndex(
    (item) => item.slug === product.slug || item.id === product.id
  );

  if (index !== -1) {
    cart[index].qty = (cart[index].qty || 1) + qty;
  } else {
    cart.push({
      ...product,
      qty: qty > 0 ? qty : 1
    });
  }

  localStorage.setItem("vb_cart", JSON.stringify(cart));
  dispatchStorageUpdate();
  return cart;
}

export function updateCartQty(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    const newQty = (cart[index].qty || 1) + delta;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    localStorage.setItem("vb_cart", JSON.stringify(cart));
    dispatchStorageUpdate();
  }
  return cart;
}

export function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem("vb_cart", JSON.stringify(cart));
    dispatchStorageUpdate();
  }
  return cart;
}

export function clearCart() {
  localStorage.removeItem("vb_cart");
  dispatchStorageUpdate();
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
  const list = getWishlist();
  return list.some(
    (item) =>
      item.id === productIdOrSlug ||
      item.slug === productIdOrSlug ||
      String(item.id) === String(productIdOrSlug)
  );
}

export function toggleWishlist(product) {
  const list = getWishlist();
  const index = list.findIndex(
    (item) => item.id === product.id || item.slug === product.slug
  );

  let added = false;
  if (index !== -1) {
    list.splice(index, 1);
    added = false;
  } else {
    list.push(product);
    added = true;
  }

  localStorage.setItem("vb_wishlist", JSON.stringify(list));
  dispatchStorageUpdate();
  return { list, added };
}

export function removeFromWishlist(productIdOrSlug) {
  const list = getWishlist();
  const filtered = list.filter(
    (item) =>
      item.id !== productIdOrSlug &&
      item.slug !== productIdOrSlug &&
      String(item.id) !== String(productIdOrSlug)
  );
  localStorage.setItem("vb_wishlist", JSON.stringify(filtered));
  dispatchStorageUpdate();
  return filtered;
}
