import { ResponseBody } from "./constants";

export async function post<T>(url: string, requestBody: object): Promise<ResponseBody<T>> {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export async function put<T>(url: string, requestBody: object): Promise<ResponseBody<T>> {
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}