# Backend Functionality: Generating Presentation Outlines

This document explains the step-by-step process of how the backend generates presentation outlines, following a service-oriented architecture where the Next.js frontend communicates with a Python backend.

### 1. Frontend Request
The process begins when the frontend sends a `POST` request to the Next.js backend at the `/api/presentations/generate-outline` endpoint.

### 2. Next.js Backend: Request Validation
The Next.js backend receives the request and validates the JSON payload, ensuring it contains the required fields: `prompt`, `slideCount`, and `language`. If any are missing, it returns a `400 Bad Request` error.

### 3. Next.js Backend: Service Discovery
The backend retrieves the URL of the Python API from the `NEXT_PUBLIC_PYTHON_API_URL` environment variable. This allows the two services to communicate. If the URL is not configured, a `500 Internal Server Error` is returned.

### 4. Next.js Backend: Forwarding the Request
The Next.js backend acts as a proxy. It forwards the validated request to the `/generate_outline` endpoint of the Python backend service.

### 5. Python Backend: Receiving the Request
The Python (FastAPI) service receives the `POST` request. The `OutlineRequest` Pydantic model validates the incoming data.

### 6. Python Backend: AI Prompt Engineering
The `generate_structured_outline` function constructs a detailed system prompt for the OpenAI `gpt-4o-mini` model. This prompt instructs the AI to act as an expert assistant and generate a presentation outline with a specific structure (slide count, language, title/content fields) and to respond *only* with a valid JSON object.

### 7. Python Backend: AI Content Generation
The Python service sends the engineered prompt to the OpenAI API, requesting a JSON response format. The AI model generates the presentation outline based on the instructions.

### 8. Python Backend: Response Parsing and Validation
The Python service receives the JSON response from the AI. It parses the response and validates that it contains a "slides" key with a list of slide objects. If the response is invalid or parsing fails, it returns a `500 Internal Server Error`.

### 9. Python Backend: Sending the Response
The Python service sends the generated array of slide outlines back to the Next.js backend in a JSON response.

### 10. Next.js Backend: Receiving and Transforming the Data
The Next.js backend receives the slide outlines from the Python service. It then transforms the data by adding a unique, client-side `id` to each slide object.

### 11. Next.js Backend: Final Response to Frontend
The Next.js backend sends a final `200 OK` response to the frontend, containing the processed outlines and additional metadata (slide count, language, and generation timestamp).

### 12. Error Handling
Both the Next.js and Python services have robust `try...catch` blocks. If an error occurs at any stage (e.g., network issue, AI API failure, data parsing error), it is logged, and an appropriate error response is sent back through the chain, preventing the system from crashing.
