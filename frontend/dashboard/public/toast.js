import { toast as svToast } from '@zerodevx/svelte-toast'

const toastThemes = {
    success: {
        '--toastBackground': '#48BB78',
        '--toastBarBackground': '#2F855A'
    },
    error: {
        '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030'
    }
};

export const toast = (txt) => svToast.push(txt);

export const toastSuccess = (txt) => {
    svToast.push(txt, {
        theme: toastThemes.success
    });
};

export const toastError = txt => {
    svToast.push(txt, {
        duration: 10000,
        theme: toastThemes.error
    })
};