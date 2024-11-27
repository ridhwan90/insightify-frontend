import { axiosInstance } from './authApi'

export interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface ChatRequest {
    messages: Message[]
}

export const createChatStream = async (messages: Message[]) => {
    try {
        const cleanedMessages = messages.map(msg => ({
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
        }));

        const response = await fetch(`${axiosInstance.defaults.baseURL}/chat-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                ...(axiosInstance.defaults.headers.common?.['Authorization'] && {
                    'Authorization': axiosInstance.defaults.headers.common['Authorization'] as string
                })
            },
            body: JSON.stringify({ messages: cleanedMessages }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        return {
            async *[Symbol.asyncIterator]() {
                if (!reader) throw new Error('Response body is null');
                
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        
                        if (done) break;
                        
                        // Decode chunk and add to buffer
                        buffer += decoder.decode(value, { stream: true });
                        
                        // Process complete messages
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || ''; // Keep incomplete line in buffer
                        
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') return;
                                try {
                                    // Parse the JSON stringified content
                                    const parsedData = JSON.parse(data);
                                    yield parsedData;
                                } catch (error) {
                                    console.error('Error parsing stream data:', error);
                                    yield data; // Fallback to raw data if parsing fails
                                }
                            }
                        }
                    }
                    
                    // Process any remaining data
                    if (buffer.startsWith('data: ')) {
                        const data = buffer.slice(6);
                        if (data !== '[DONE]') {
                            try {
                                const parsedData = JSON.parse(data);
                                yield parsedData;
                            } catch (error) {
                                console.error('Error parsing remaining stream data:', error);
                                yield data;
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                }
            }
        };
    } catch (error) {
        console.error('Chat stream error:', error);
        throw error;
    }
};

// Helper function to create a message
export const createMessage = (role: Message['role'], content: string): Message => ({
    role,
    content: content.trim()
});