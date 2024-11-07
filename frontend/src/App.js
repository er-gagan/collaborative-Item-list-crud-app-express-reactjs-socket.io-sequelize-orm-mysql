import React, { useState, useEffect, useCallback } from 'react';
import { fetchItemsApi, addItemApi, updateItemApi, deleteItemApi } from "./apiService";
import socket from "./socket";
import toast, { Toaster } from 'react-hot-toast';
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();

    // Setup socket listeners
    socket.on("itemAdded", (item) => {
      setItems((prev) => [...prev, item]);
      toast.success("Item added successfully");
    });

    socket.on("itemUpdated", (updatedItem) => {
      setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      toast.success("Item updated successfully");
    });

    socket.on("itemDeleted", (id) => {
      setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      toast.success("Item deleted successfully");
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off("itemAdded");
      socket.off("itemUpdated");
      socket.off("itemDeleted");
    };
  }, []);

  // Fetch items from the API
  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchItemsApi();
      setItems(response);
    } catch (error) {
      toast.error("Failed to load items.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate item input
  const isValidInput = (input) => {
    if (!input.trim()) {
      toast.error("Item name cannot be empty.");
      return false;
    }
    return true;
  };

  // Add item to the list
  const addItem = async () => {
    if (!isValidInput(newItem)) return;

    try {
      await addItemApi(newItem);
      setNewItem("");
    } catch (error) {
      toast.error("Failed to add item.");
    }
  };

  // Update item name
  const updateItem = async (id) => {
    const name = prompt("Enter new name for the item");
    if (name && isValidInput(name)) {
      try {
        await updateItemApi(id, name);
      } catch (error) {
        toast.error("Failed to update item.");
      }
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItemApi(id);
      } catch (error) {
        toast.error("Failed to delete item.");
      }
    }
  };
  return (<>
    <div className="container">
      <h1>Collaborative Item List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter a new item"
        />
        <button onClick={addItem} disabled={isLoading} className="add-btn">
          {isLoading ? "Loading..." : "Add Item"}
        </button>
      </div>
      <ul className="item-list">
        {items.map((item) => (
          <li className="item" key={item.id}>
            <span className="item-name">{item.name}</span>
            <div className="item-buttons">
              <button onClick={() => updateItem(item.id)} className="update-btn">
                Update
              </button>
              <button onClick={() => deleteItem(item.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <Toaster />
  </>
  );
}

export default App;
