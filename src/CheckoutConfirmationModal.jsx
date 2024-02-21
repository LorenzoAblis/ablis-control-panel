// import React from 'react';
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, remove, set, get } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const CheckoutConfirmationModal = (props) => {
  const {
    items,
    showCheckoutConfirmationModal,
    setShowCheckoutConfirmationModal,
  } = props;

  const handleClose = () => {
    setShowCheckoutConfirmationModal(false);
  };

  const handleCheckout = async () => {
    items
      .filter((item) => item.completed)
      .map(async (item) => {
        if (item.name) {
          const timestamp = Date.now();
          const formattedDate = new Date(timestamp).toLocaleDateString("en-US");

          const itemRef = ref(db, "inventory/" + item.name);
          const snapshot = await get(itemRef);
          const currentItem = snapshot.val();

          if (currentItem) {
            // If the item exists, update its quantity
            const newQuantity = currentItem.quantity + item.quantity;
            await set(ref(db, "inventory/" + item.name), {
              ...currentItem,
              quantity: newQuantity,
              timestamp: formattedDate,
            });
          } else {
            // If the item doesn't exist, add it to the inventory
            await set(ref(db, "inventory/" + item.name), {
              name: item.name,
              quantity: item.quantity,
              location: item.location,
              timestamp: formattedDate,
              category: "", // Electronics, Food, etc
              expirationDate: "", // Blank expiration date
              notes: "", // Notes
            });
          }

          await remove(ref(db, "shopping_items/" + item.name));
        }
      });

    toast.success("Checkout successful!");
    setShowCheckoutConfirmationModal(false);
  };

  return (
    <>
      <Modal show={showCheckoutConfirmationModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to checkout?
          <br /> This will delete{" "}
          <span className="fw-bold">
            {items.filter((item) => item.completed).length}
          </span>{" "}
          items
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleCheckout}>
            Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CheckoutConfirmationModal.propTypes = {
  items: PropTypes.array.isRequired,
  showCheckoutConfirmationModal: PropTypes.bool.isRequired,
  setShowCheckoutConfirmationModal: PropTypes.func.isRequired,
};

export default CheckoutConfirmationModal;
