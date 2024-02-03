import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import toast from 'react-hot-toast';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AddItemModal = (props) => {
  const { showAddItemModal, setShowAddItemModal } = props;

  const [newItem, setNewItem] = useState({});

  const handleClose = () => setShowAddItemModal(false);

  const handleAdd = async () => {
    if (newItem.name) {
      await set(ref(db, 'shopping_items/' + newItem.name), {
        name: newItem.name,
        quantity: newItem.quantity || '',
        location: newItem.location || '',
        description: newItem.description || '',
        completed: false,
      });

      setNewItem({});
    }
    setShowAddItemModal(false);
    setTimeout(() => {
      toast.success(`Added ${newItem.name} to shopping list`);
    }, 100);
  };

  const handleChange = (e) => {
    setNewItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Modal show={showAddItemModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Item Name"
            name="name"
            value={newItem.name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Quantity"
            name="quantity"
            value={newItem.quantity}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={newItem.location}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={newItem.description}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAdd}>
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddItemModal.propTypes = {
  showAddItemModal: PropTypes.bool.isRequired,
  setShowAddItemModal: PropTypes.func.isRequired,
};

export default AddItemModal;
