import toast from 'react-hot-toast';

// Success toast notification
export const showSuccessToast = (message) => {
  return toast.success(message, {
    icon: '✅',
  });
};

// Error toast notification
export const showErrorToast = (message) => {
  return toast.error(message, {
    icon: '❌',
  });
};

// Info toast notification
export const showInfoToast = (message) => {
  return toast(message, {
    icon: 'ℹ️',
  });
};

// Warning toast notification
export const showWarningToast = (message) => {
  return toast(message, {
    icon: '⚠️',
    style: {
      background: '#FFC107',
      color: '#333',
    },
  });
};

// Toast for adding product to cart
export const showAddToCartToast = (productName) => {
  return toast.success(`${productName} added to cart!`, {
    icon: '🛒',
  });
};

// Toast for adding product to favorites
export const showAddToFavoritesToast = (productName) => {
  return toast.success(`${productName} added to favorites!`, {
    icon: '❤️',
  });
};

// Toast for order placed successfully
export const showOrderSuccessToast = () => {
  return toast.success('Order placed successfully!', {
    icon: '🎉',
    duration: 5000,
    style: {
      background: '#00C851',
      color: '#fff',
    },
  });
};

// Toast for custom components or loading states
export const showLoadingToast = (message, promise) => {
  return toast.promise(promise, {
    loading: message,
    success: 'Successfully completed!',
    error: 'Something went wrong',
  });
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
}; 