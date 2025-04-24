import React, { useState, useEffect } from 'react';
import './App.css';

function ChecklistItem({ item, toggleItem, deleteItem }) {
  return (
    <div className="item">
      <div className="item-left">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleItem(item.id)}
        />
        <span className={item.checked ? 'checked' : ''}>{item.text}</span>
      </div>
      <button className="delete-btn" onClick={() => deleteItem(item.id)}>Delete</button>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedItemsString = localStorage.getItem('checklistItems');
      
      if (savedItemsString) {
        const parsedItems = JSON.parse(savedItemsString);
        setItems(parsedItems);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading from localStorage");
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('checklistItems', JSON.stringify(items));
      } catch (error) {
        console.error("Error saving to localStorage");
      }
    }
  }, [items, isInitialized]);

  const addItem = (e) => {
    e.preventDefault();
    if (newItemText.trim()) {
      setItems([
        ...items,
        { id: Date.now(), text: newItemText, checked: false },
      ]);
      setNewItemText('');
    }
  };

  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'completed') {
      return item.checked;
    } else if (filter === 'incomplete') {
      return !item.checked;
    } else {
      return true;
    }
  });

  const clearCompleted = () => {
    setItems(items.filter(item => !item.checked));
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Your Checklist</h1>
        
        <form className="add-form" onSubmit={addItem}>
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Enter new item"
          />
          <button type="submit" className="add-btn">Add Item</button>
        </form>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'filter-btn-blue' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'filter-btn-green' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filter === 'incomplete' ? 'filter-btn-red' : ''}`}
            onClick={() => setFilter('incomplete')}
          >
            Incomplete
          </button>
          {items.some(item => item.checked) && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>

        <div className="items-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                toggleItem={toggleItem}
                deleteItem={deleteItem}
              />
            ))
          ) : (
            <p className="empty-message">No items here</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;