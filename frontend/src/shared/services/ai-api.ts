/**
 * AI API Client for AXENT Platform
 * Handles all communication with the FastAPI AI backend
 */

// Vite environment variables
interface ImportMetaEnv {
    readonly VITE_AI_API_URL?: string;
    readonly VITE_AI_API_TIMEOUT?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

const API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = parseInt(import.meta.env.VITE_AI_API_TIMEOUT || '30000');

// Type definitions
export interface PriceEstimateRequest {
    equipment_type: string;
    equipment_category: string;
    condition: string;
    age_years: number;
    location: string;
    duration_hours?: number;
    season?: string;
}

export interface PriceEstimateResponse {
    estimated_price_per_hour: number;
    confidence_score: number;
    price_range_min: number;
    price_range_max: number;
    factors: {
        condition_impact: number;
        age_impact: number;
        location_demand: number;
        seasonal_factor: number;
    };
    market_trend: string;
}

export interface RecommendationRequest {
    user_id: string;
    current_equipment_id?: string;
    user_role: string;
    location?: string;
    limit?: number;
}

export interface EquipmentRecommendation {
    equipment_id: string;
    name: string;
    type: string;
    score: number;
    price_per_hour: number;
    location: string;
    available: boolean;
    image_url?: string;
    reason: string;
    specifications?: Record<string, any>;
}

export interface RecommendationResponse {
    recommendations: EquipmentRecommendation[];
    total_count: number;
    algorithm_used: string;
}

export interface ForecastRequest {
    equipment_type: string;
    region: string;
    forecast_days?: number;
    include_seasonality?: boolean;
}

export interface ForecastDataPoint {
    date: string;
    predicted_demand: number;
    confidence_interval_lower: number;
    confidence_interval_upper: number;
}

export interface ForecastResponse {
    equipment_type: string;
    region: string;
    forecast_data: ForecastDataPoint[];
    overall_trend: string;
    peak_demand_date?: string;
    seasonal_pattern?: Record<string, number>;
    model_accuracy: number;
}

export interface ImageAnalysisResponse {
    equipment_type?: string;
    equipment_type_confidence?: number;
    condition_assessment?: string;
    condition_score?: number;
    brand_identified?: string;
    brand_confidence?: number;
    detected_features: string[];
    recommendations: string[];
}

export interface ChatMessage {
    message: string;
    user_id?: string;
    conversation_id?: string;
}

export interface ChatResponse {
    message: string;
    conversation_id: string;
    suggested_actions?: string[];
    equipment_suggestions?: string[];
}

/**
 * API Client Class
 */
class AIAPIClient {
    private baseURL: string;
    private timeout: number;

    constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
        this.baseURL = baseURL;
        this.timeout = timeout;
    }

    /**
     * Generic fetch wrapper with timeout and error handling
     */
    private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(error.error || error.detail || `HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * Estimate equipment price
     */
    async estimatePrice(request: PriceEstimateRequest): Promise<PriceEstimateResponse> {
        const response = await this.fetchWithTimeout(`${this.baseURL}/estimate/price`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return response.json();
    }

    /**
     * Get equipment recommendations
     */
    async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
        const response = await this.fetchWithTimeout(`${this.baseURL}/recommend/equipment`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return response.json();
    }

    /**
     * Forecast demand
     */
    async forecastDemand(request: ForecastRequest): Promise<ForecastResponse> {
        const response = await this.fetchWithTimeout(`${this.baseURL}/forecast/demand`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return response.json();
    }

    /**
     * Analyze equipment image
     */
    async analyzeImage(
        file: File,
        options: {
            analyze_condition?: boolean;
            detect_type?: boolean;
            identify_brand?: boolean;
        } = {}
    ): Promise<ImageAnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('analyze_condition', String(options.analyze_condition ?? true));
        formData.append('detect_type', String(options.detect_type ?? true));
        formData.append('identify_brand', String(options.identify_brand ?? false));

        const response = await this.fetchWithTimeout(`${this.baseURL}/vision/analyze`, {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set Content-Type with boundary
        });
        return response.json();
    }

    /**
     * Send chat message
     */
    async sendChatMessage(request: ChatMessage): Promise<ChatResponse> {
        const response = await this.fetchWithTimeout(`${this.baseURL}/chat/message`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return response.json();
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string; service: string; version: string }> {
        const response = await this.fetchWithTimeout(`${this.baseURL.replace('/api/v1', '')}/health`);
        return response.json();
    }
}

// Export singleton instance
export const aiAPI = new AIAPIClient();

// Export class for testing
export { AIAPIClient };
