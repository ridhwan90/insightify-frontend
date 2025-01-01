import { axiosInstance } from './authApi'

export const analyzeArchitectPlan = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const initialResponse = await axiosInstance.post('/architect-ai', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                 ...(axiosInstance.defaults.headers.common?.['Authorization'] && {
                    'Authorization': axiosInstance.defaults.headers.common['Authorization'] as string
                })
            },
        });

        const id = initialResponse.data.id;
        if (!id) {
            throw new Error('No ID returned from /architect-ai');
        }

        const poll = async (): Promise<any> => {
            const statusResponse = await axiosInstance.get(`/architect-ai/${id}`);
            if (statusResponse.data.state === 'completed') {
                return statusResponse.data;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            return poll();
        };

        return await poll();
    } catch (error) {
        console.error('Error analyzing architect plan:', error);
        throw error;
    }
};
