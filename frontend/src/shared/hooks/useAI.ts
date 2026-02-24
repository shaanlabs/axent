/**
 * React hooks for AI features
 */
import { useState, useCallback } from 'react';
import {
    aiAPI,
    PriceEstimateRequest,
    PriceEstimateResponse,
    RecommendationRequest,
    RecommendationResponse,
    ForecastRequest,
    ForecastResponse,
    ImageAnalysisResponse,
    ChatMessage,
    ChatResponse,
} from '../services/ai-api';

interface UseAIState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Hook for price estimation
 */
export function usePriceEstimate() {
    const [state, setState] = useState<UseAIState<PriceEstimateResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const estimate = useCallback(async (request: PriceEstimateRequest) => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await aiAPI.estimatePrice(request);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to estimate price';
            setState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    return { ...state, estimate };
}

/**
 * Hook for equipment recommendations
 */
export function useRecommendations() {
    const [state, setState] = useState<UseAIState<RecommendationResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const getRecommendations = useCallback(async (request: RecommendationRequest) => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await aiAPI.getRecommendations(request);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get recommendations';
            setState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    return { ...state, getRecommendations };
}

/**
 * Hook for demand forecasting
 */
export function useForecast() {
    const [state, setState] = useState<UseAIState<ForecastResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const forecast = useCallback(async (request: ForecastRequest) => {
        setState({ data: null, loading: true, error: null });
        try {
            const data = await aiAPI.forecastDemand(request);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to forecast demand';
            setState({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    return { ...state, forecast };
}

/**
 * Hook for image analysis
 */
export function useImageAnalysis() {
    const [state, setState] = useState<UseAIState<ImageAnalysisResponse>>({
        data: null,
        loading: false,
        error: null,
    });

    const analyzeImage = useCallback(
        async (
            file: File,
            options?: {
                analyze_condition?: boolean;
                detect_type?: boolean;
                identify_brand?: boolean;
            }
        ) => {
            setState({ data: null, loading: true, error: null });
            try {
                const data = await aiAPI.analyzeImage(file, options);
                setState({ data, loading: false, error: null });
                return data;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image';
                setState({ data: null, loading: false, error: errorMessage });
                throw error;
            }
        },
        []
    );

    return { ...state, analyzeImage };
}

/**
 * Hook for AI chatbot
 */
export function useChatbot() {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(
        async (message: string, userId?: string) => {
            setLoading(true);
            setError(null);

            // Add user message to chat
            setMessages((prev) => [...prev, { role: 'user', content: message }]);

            try {
                const request: ChatMessage = {
                    message,
                    user_id: userId,
                    conversation_id: conversationId || undefined,
                };

                const response = await aiAPI.sendChatMessage(request);

                // Update conversation ID
                if (response.conversation_id) {
                    setConversationId(response.conversation_id);
                }

                // Add assistant response
                setMessages((prev) => [...prev, { role: 'assistant', content: response.message }]);

                setLoading(false);
                return response;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
                setError(errorMessage);
                setLoading(false);
                throw error;
            }
        },
        [conversationId]
    );

    const clearConversation = useCallback(() => {
        setMessages([]);
        setConversationId(null);
        setError(null);
    }, []);

    return {
        messages,
        loading,
        error,
        conversationId,
        sendMessage,
        clearConversation,
    };
}

/**
 * Hook for AI backend health check
 */
export function useAIHealth() {
    const [healthy, setHealthy] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const checkHealth = useCallback(async () => {
        setLoading(true);
        try {
            const result = await aiAPI.healthCheck();
            setHealthy(result.status === 'healthy');
            setLoading(false);
            return result;
        } catch (error) {
            setHealthy(false);
            setLoading(false);
            throw error;
        }
    }, []);

    return { healthy, loading, checkHealth };
}
