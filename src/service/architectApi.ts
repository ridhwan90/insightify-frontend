import { axiosInstance } from './authApi'

export const analyzeArchitectPlan = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/architect-ai', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                 ...(axiosInstance.defaults.headers.common?.['Authorization'] && {
                    'Authorization': axiosInstance.defaults.headers.common['Authorization'] as string
                })
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing architect plan:', error);
        throw error;
    }
};
