import { axiosInstance } from './authApi'
import axios from 'axios';

export const analyzeArchitectPlan = async (file: File) => {
    try {
        const fileName = file.name.replace(/\s+/g, '_');

        const initialResponse = await axiosInstance.post('/architect-ai', { file_name: fileName }, {
            headers: {
                 ...(axiosInstance.defaults.headers.common?.['Authorization'] && {
                    'Authorization': axiosInstance.defaults.headers.common['Authorization'] as string
                })
            },
        });

        const { id, preSignedURL } = initialResponse.data;
        if (!id || !preSignedURL) {
            throw new Error('No ID or preSignedURL returned from /architect-ai');
        }

        const decodedPreSignedURL = decodeURIComponent(preSignedURL);

        console.log('Decoded preSignedURL:', decodedPreSignedURL)

        
        const formData = new FormData();
        formData.append(file.name, file);

        await axios.put(decodedPreSignedURL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

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
