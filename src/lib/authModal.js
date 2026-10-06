// Global Auth Modal Helper Event Dispatcher
export const AUTH_MODAL_EVENT = "vb_open_auth_modal";
export const AUTH_MODAL_CLOSE_EVENT = "vb_close_auth_modal";

export function openAuthModal(options = {}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_MODAL_EVENT, {
        detail: {
          directItem: options.directItem || null,
          redirectTo: options.redirectTo || "/checkout",
          onSuccess: options.onSuccess || null,
          message: options.message || "",
        },
      })
    );
  }
}

export function closeAuthModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_MODAL_CLOSE_EVENT));
  }
}
