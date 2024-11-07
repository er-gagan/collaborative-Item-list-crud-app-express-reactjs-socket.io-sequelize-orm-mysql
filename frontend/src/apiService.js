import axios from "axios";

const API_URL = "http://localhost:5000/items";

// Fetch all items
export const fetchItemsApi = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Add a new item
export const addItemApi = async (name) => {
    const response = await axios.post(API_URL, { name });
    return response.data;
};

// Update an existing item
export const updateItemApi = async (id, name) => {
    const response = await axios.put(`${API_URL}/${id}`, { name });
    return response.data;
};

// Delete an item
export const deleteItemApi = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
