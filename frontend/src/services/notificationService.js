import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notificationService = {
    success: (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    },

    error: (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    },

    info: (message) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    },

    warning: (message) => {
        toast.warning(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    },

    progress: (message) => {
        return toast.loading(message, {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    },

    updateProgress: (toastId, message, type = 'success') => {
        toast.update(toastId, {
            render: message,
            type: type,
            isLoading: false,
            autoClose: 3000,
        });
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    }
};

export default notificationService; 