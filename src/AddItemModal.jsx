import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";

const AddItemModal = (props) => {
  const { showAddItemModal, setShowAddItemModal } = props;

  const [newItem, setNewItem] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);

  const handleClose = () => setShowAddItemModal(false);

  const handleAdd = async () => {
    if (newItem.name) {
      await set(ref(db, "shopping_items/" + newItem.name), {
        name: newItem.name,
        quantity: newItem.quantity || "",
        location: newItem.location || "",
        description: newItem.description || "",
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

  const handleDropdownClick = (item) => {
    setNewItem((prev) => ({
      ...prev,
      name: item.name,
      location: item.location,
    }));
  };

  const fetchItems = () => {
    const itemsRef = ref(db, "inventory");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newItems = Object.values(data).map((item) => item);
        setInventoryItems(newItems);
      } else {
        setInventoryItems([]);
      }
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Modal show={showAddItemModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown className="mb-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select from inventory
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {inventoryItems.map((item, index) => (
                <Dropdown.Item
                  key={item.name}
                  onClick={() => handleDropdownClick(item)}
                >
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Form>
            <Form.Group md="4" controlId="validationCustomUsername">
              <InputGroup hasValidation>
                <InputGroup.Text>Item Name</InputGroup.Text>
                <Form.Control type="text" placeholder="" required />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>

          <input
            type="text"
            placeholder="Item Name"
            name="name"
            value={newItem.name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Amount"
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
