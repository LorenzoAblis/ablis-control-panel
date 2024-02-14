import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, set, remove } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditItemModal from "./EditItemModal";

const ExpandedItemModal = (props) => {
  const { item, showExpandedView, setShowExpandedView } = props;

  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const handleClose = () => setShowExpandedView(false);

  return (
    <>
      <Modal show={showExpandedView} onHide={handleClose}>
        <Modal.Header closeButton className="d-flex gap-3">
          <Modal.Title className="fs-1">{item.name}</Modal.Title>
          <Button variant="success" onClick={() => setShowEditItemModal(true)}>
            <i className="bi bi-pencil-square"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>
            Quantity: <span className="fw-bold">{item.quantity}</span>
          </p>
          <p>
            Location: <span className="fw-bold">{item.location}</span>
          </p>
          <p>
            Category: <span className="fw-bold">{item.category}</span>
          </p>
          <p>
            Last Bought: <span className="fw-bold">{item.timestamp}</span>
          </p>
          <p>
            Expiration Date:{" "}
            <span className="fw-bold">{item.expirationDate}</span>
          </p>
          <p>
            Notes: <span className="fw-bold">{item.notes}</span>
          </p>
        </Modal.Body>
      </Modal>

      <EditItemModal
        item={item}
        editType="inventory"
        showEditItemModal={showEditItemModal}
        setShowEditItemModal={setShowEditItemModal}
        setShowExpandedView={setShowExpandedView}
      />
    </>
  );
};

ExpandedItemModal.propTypes = {
  item: PropTypes.object.isRequired,
  showExpandedView: PropTypes.bool.isRequired,
  setShowExpandedView: PropTypes.func.isRequired,
};

export default ExpandedItemModal;
