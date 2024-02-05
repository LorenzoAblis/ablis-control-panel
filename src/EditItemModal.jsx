import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, set, remove } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EditItemModal = (props) => {
  const { item, showEditItemModal, setShowEditItemModal } = props;

  const [edittedItem, setEdittedItem] = useState({ name: item.name });

  const handleClose = () => setShowEditItemModal(false);

  const handleEdit = async () => {
    if (item.name) {
      await remove(ref(db, "shopping_items/" + item.name));
      await set(ref(db, "shopping_items/" + edittedItem.name), edittedItem);
    }

    setEdittedItem({});

    setTimeout(() => {
      toast.success(`Editted ${item.name}`);
    }, 100);
    setShowEditItemModal(false);
  };

  const handleDelete = async () => {
    if (item.name) {
      await remove(ref(db, "shopping_items/" + item.name));
    }

    toast.success(`Deleted ${item.name}`);
    setShowEditItemModal(false);
  };

  const handleChange = (e) => {
    setEdittedItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    setEdittedItem(item);
  }, [item]);

  return (
    <>
      <Modal show={showEditItemModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Item Name"
            name="name"
            value={edittedItem.name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Quantity"
            name="quantity"
            value={edittedItem.quantity}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={edittedItem.location}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={edittedItem.description}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

EditItemModal.propTypes = {
  item: PropTypes.object.isRequired,
  showEditItemModal: PropTypes.bool.isRequired,
  setShowEditItemModal: PropTypes.func.isRequired,
};

export default EditItemModal;
