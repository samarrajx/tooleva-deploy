/**
 * Core utility functions for Tooleva
 */

export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export function showToast(message, type = 'success') {
    // Check if toast container exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colorClass = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    toast.className = `${colorClass} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between transform transition-all duration-300 translate-y-full opacity-0`;
    
    toast.innerHTML = `
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200 focus:outline-none">&times;</button>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    }, 10);

    const removeToast = () => {
        toast.classList.add('opacity-0', 'translate-y-full');
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('button').addEventListener('click', removeToast);

    // Auto remove after 5s
    setTimeout(removeToast, 5000);
}

// Ensure elements exist before manipulation
export function getEl(id) {
    return document.getElementById(id);
}
