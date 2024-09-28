import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import UserHeader from "components/Headers/UserHeader.js";
import { useAuth } from "AuthContext"; // Importer le contexte d'authentification

const Profile = () => {
  const { user, setUser } = useAuth(); // Utiliser l'état global de l'utilisateur
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9001/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // Mettre à jour l'état global de l'utilisateur
        setFormData({
          userName: response.data.userName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          password: "",
          avatar: null, // Initialiser à null pour l'image
        });
      } catch (error) {
        setError("Une erreur est survenue lors de la récupération des données utilisateur.");
      }
    };

    fetchUserProfile();
  }, [setUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.put("http://localhost:9001/user", formDataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mise à jour de l'état global de l'utilisateur avec la nouvelle réponse
      setUser(response.data);
      setFormData({
        userName: response.data.userName,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        password: "", // Remettre le mot de passe à vide
        avatar: null, // Réinitialiser l'avatar pour éviter la disparition de l'image
      });

      setError("Profil mis à jour avec succès.");
    } catch (error) {
      setError("Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:9001/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/auth/login");
    } catch (error) {
      setError("Une erreur est survenue lors de la suppression du compte.");
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const confirmDeleteAccount = () => {
    handleDeleteAccount();
    toggleModal();
  };

  // Si user n'est pas encore chargé, afficher un loader ou une condition de fallback
  if (!user) {
    return <div>Chargement...</div>; // Ou un spinner de chargement
  }

  return (
    <>
      <UserHeader userName={user.userName} userAvatar={user.avatar} />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow" style={{ minHeight: "250px", backgroundColor: "#3498db", color: "#ffffff" }}>
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={`http://localhost:9001/images/users/${user.avatar}`}
                        style={{ width: "140px", height: "140px" }} // Augmentation de la taille de l'image
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardBody className="pt-0 pt-md-4 text-center" style={{ marginTop: "70px" }}>
                <Row className="mt-4">
                  <Col className="text-left">
                    <Button
                      className="btn-sm"
                      color="info"
                      onClick={handleUpdateAccount}
                      style={{ fontSize: "12px" }}
                    >
                      Mettre à jour
                    </Button>
                  </Col>
                  <Col className="text-right">
                    <Button
                      className="btn-sm"
                      color="danger"
                      onClick={toggleModal}
                      style={{ fontSize: "12px" }}
                    >
                      Supprimer
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mon compte</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={handleUpdateAccount}
                      size="sm"
                    >
                      Enregistrer
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleUpdateAccount}>
                  <h6 className="heading-small text-muted mb-4">
                    Informations utilisateur
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nom d'utilisateur
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            id="input-username"
                            placeholder="Nom d'utilisateur"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Adresse e-mail
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            id="input-email"
                            placeholder="Adresse e-mail"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            Numéro de téléphone
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            id="input-phone"
                            placeholder="Numéro de téléphone"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Mot de passe
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            id="input-password"
                            placeholder="Nouveau mot de passe"
                            type="password"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-avatar"
                          >
                            Avatar
                          </label>
                          <div className="custom-file">
                            <Input
                              className="custom-file-input"
                              id="input-avatar"
                              type="file"
                              onChange={handleFileChange}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="input-avatar"
                            >
                              Choisir une image
                            </label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">À propos de moi</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>À propos de moi</label>
                      <Input
                        className="form-control-alternative"
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleInputChange}
                        placeholder="Quelques mots sur vous..."
                        rows="4"
                        type="textarea"
                      />
                    </FormGroup>
                  </div>
                  {error && <div className="text-danger text-center">{error}</div>}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody>
          Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteAccount}>
            Supprimer
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Profile;
