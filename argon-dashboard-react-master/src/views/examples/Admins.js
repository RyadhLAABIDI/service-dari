import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [modal, setModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    avatar: null,
  });

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:9001/user/admins");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newAdmin).forEach(key => {
      if (newAdmin[key] !== null && newAdmin[key] !== '') {
        formData.append(key, newAdmin[key]);
      }
    });
  
    try {
      const response = await axios.post('http://localhost:9001/newAdmin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajout de l'autorisation via le token
        },
      });
  
      if (response.status === 201) {
        fetchAdmins(); // Rafraîchit la liste des administrateurs après l'ajout
        setModal(false); // Ferme le modal
        setNewAdmin({ // Réinitialise les champs du formulaire
          userName: '',
          email: '',
          phoneNumber: '',
          password: '',
          avatar: null,
        });
      } else {
        console.error("Erreur lors de l'ajout de l'administrateur:", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'administrateur:", error);
    }
  };
  
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Gestion des Administrateurs</h3>
                <Button color="primary" onClick={toggleModal}>
                  <FaPlus /> Ajouter un Administrateur
                </Button>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Photo</th>
                      <th scope="col">Nom d'utilisateur</th>
                      <th scope="col">Email</th>
                      <th scope="col">Téléphone</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin._id}>
                        <td>
                          <img
                            src={`http://localhost:9001/images/users/${admin.avatar}`}
                            alt={admin.userName}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{admin.userName}</td>
                        <td>{admin.email}</td>
                        <td>{admin.phoneNumber}</td>
                        <td className="text-right">
                          <Button color="danger" size="sm">
                            <FaTrash /> Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Ajouter un Administrateur</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddAdmin}>
            <FormGroup>
              <Label for="userName">Nom d'utilisateur</Label>
              <Input
                type="text"
                id="userName"
                value={newAdmin.userName}
                onChange={(e) => setNewAdmin({ ...newAdmin, userName: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="phoneNumber">Téléphone</Label>
              <Input
                type="text"
                id="phoneNumber"
                value={newAdmin.phoneNumber}
                onChange={(e) => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Mot de passe</Label>
              <Input
                type="password"
                id="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="avatar-upload">Photo de profil</Label>
              <div className="custom-file-upload">
                <input
                  type="file"
                  name="avatar"
                  id="avatar-upload"
                  onChange={(e) => setNewAdmin({ ...newAdmin, avatar: e.target.files[0] })}
                  style={{ display: 'none' }}
                />
                <Button
                  color="secondary"
                  onClick={() => document.getElementById('avatar-upload').click()}
                  startIcon={<FaUpload />}
                >
                  Choisir une image
                </Button>
                {newAdmin.avatar && <span className="ml-2">{newAdmin.avatar.name}</span>}
              </div>
            </FormGroup>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                Ajouter
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Admins;
