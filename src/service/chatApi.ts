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
        // Clean the messages to ensure no double-encoded JSON
        const cleanedMessages = messages.map(msg => ({
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
        }));

        // Get the response as a stream
        const response = await fetch(`${axiosInstance.defaults.baseURL}/chat-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                // Include authorization header if present in axiosInstance
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

        // Create a new ReadableStream from the response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let isStreamActive = true;

        return {
            async *[Symbol.asyncIterator]() {
                if (!reader) throw new Error('Response body is null');
                
                try {
                    while (isStreamActive) {
                        const { done, value } = await reader.read();
                        
                        if (done) {
                            break;
                        }
                        
                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');
                        
                        for (const line of lines) {
                            if (!isStreamActive) break;
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                yield data;
                            }
                        }
                    }
                } finally {
                    if (reader) {
                        try {
                            await reader.cancel();
                        } catch (e) {
                            // Ignore errors during cancellation
                        }
                        reader.releaseLock();
                    }
                }
            },
            close() {
                isStreamActive = false;
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