import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { FaSearch } from 'react-icons/fa';

const BookingAdmin = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [modal, setModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:9001/service/getAllService");
      const serviceOptions = response.data.map(service => ({
        value: service._id,
        label: service.title
      }));
      serviceOptions.unshift({ value: 'all', label: 'Toutes les Réservations' }); // Ajouter l'option pour toutes les réservations
      setServices(serviceOptions);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  const fetchBookingsByService = useCallback(async (serviceId) => {
    try {
      let response;
      if (serviceId === 'all') {
        response = await axios.get("http://localhost:9001/booking/getAllBooknig"); // Consommer la fonction getAllBookings
      } else {
        response = await axios.get(`http://localhost:9001/booking/getBookingsByServiceId/${serviceId}`);
      }
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  const toggleModal = (booking = null) => {
    setBookingDetails(booking);
    setModal(!modal);
  };

  const handleServiceChange = (selectedOption) => {
    setSelectedService(selectedOption);
    if (selectedOption) {
      fetchBookingsByService(selectedOption.value);
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      borderColor: "#5e72e4",
      padding: "2px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#5e72e4",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      marginTop: "0",
      backgroundColor: "#f8f9fa",
    }),
    menuList: (base) => ({
      ...base,
      padding: "0",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#5e72e4" : "#fff",
      color: isFocused ? "#fff" : "#000",
      "&:active": {
        backgroundColor: "#5e72e4",
        color: "#fff",
      },
    }),
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Gestion des Réservations</h3>
                <Select
                  id="serviceSelect"
                  value={selectedService}
                  onChange={handleServiceChange}
                  options={services}
                  placeholder="Sélectionner un Service"
                  isClearable
                  styles={customStyles} // Appliquer les styles personnalisés
                />
              </CardHeader>
              <CardBody>
                {bookings.length > 0 ? (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Client</th>
                        <th scope="col">Fournisseur</th>
                        <th scope="col">Service</th>
                        <th scope="col">Date</th>
                        <th scope="col">Statut</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id}>
                          <td>{booking.client?.userName}</td>
                          <td>{booking.provider?.userName}</td>
                          <td>
                            <img
                              src={`http://localhost:9001/images/service/${booking.service?.avatar}`}
                              alt={booking.service?.title}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <span className="ml-2">{booking.service?.title}</span>
                          </td>
                          <td>{new Date(booking.date).toLocaleDateString()}</td>
                          <td>{booking.status}</td>
                          <td className="text-right">
                            <Button color="info" size="sm" onClick={() => toggleModal(booking)}>
                              <FaSearch /> Détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center">Aucune réservation trouvée pour ce service.</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Détails de la Réservation
        </ModalHeader>
        <ModalBody>
          {bookingDetails && (
            <>
              <p><strong>Client:</strong> {bookingDetails.client?.userName}</p>
              <p><strong>Fournisseur:</strong> {bookingDetails.provider?.userName}</p>
              <p><strong>Service:</strong> {bookingDetails.service?.title}</p>
              <p><strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}</p>
              <p><strong>Statut:</strong> {bookingDetails.status}</p>
              <p><strong>Commentaire:</strong> {bookingDetails.comments || "Aucun commentaire"}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default BookingAdmin;
