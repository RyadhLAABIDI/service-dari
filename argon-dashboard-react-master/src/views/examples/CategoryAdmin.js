import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { FaTrash, FaPlus, FaUpload } from 'react-icons/fa';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Fonction pour récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:9001/category/getAllParentCategoriesWithSubcategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fonction pour ajouter une nouvelle catégorie
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newCategory);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      await axios.post('http://localhost:9001/category/addParentCategory', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      setNewCategory('');
      setAvatar(null);
      fetchCategories(); // Refresh categories after adding
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Fonction pour marquer une catégorie comme supprimée
  const handleDeleteCategory = async () => {
    try {
      await axios.patch(`http://localhost:9001/category/categories/${selectedCategoryId}`);
      fetchCategories(); // Refresh categories after deletion
      toggleModal(); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Ouvre le dialogue de confirmation de suppression
  const toggleModal = (categoryId = null) => {
    setSelectedCategoryId(categoryId);
    setModal(!modal);
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Gestion des Catégories</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleAddCategory}>
                  <FormGroup>
                    <Label for="categoryName">Nom de la Catégorie</Label>
                    <Input
                      type="text"
                      name="categoryName"
                      id="categoryName"
                      placeholder="Entrer le nom de la catégorie"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="avatar-upload">Image de la Catégorie</Label>
                    <div className="custom-file-upload">
                      <input
                        type="file"
                        name="avatar"
                        id="avatar-upload"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      <Button
                        color="secondary"
                        onClick={() => document.getElementById('avatar-upload').click()}
                        startIcon={<FaUpload />}
                      >
                        Choisir une image
                      </Button>
                      {avatar && <span className="ml-2">{avatar.name}</span>}
                    </div>
                  </FormGroup>
                  <Button color="primary" type="submit" startIcon={<FaPlus />}>
                    Ajouter Catégorie
                  </Button>
                </Form>
                <hr />
                <h4 className="mb-4">Liste des Catégories</h4>
                <Row>
                  {categories.map((category) => (
                    <Col xs={12} sm={6} md={4} key={category._id} className="mb-4">
                      <Card className="shadow">
                        <CardBody className="text-center">
                          <img
                            src={`http://localhost:9001/images/category/${category.avatar}`}
                            alt={category.name}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '15px' }}
                          />
                          <h5>{category.name}</h5>
                          <p>Sous-catégories: {category.SubCategory.map(sub => sub.name).join(", ")}</p>
                          <Button color="danger" size="sm" onClick={() => toggleModal(category._id)}>
                            <FaTrash /> Supprimer
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirmer la Suppression</ModalHeader>
        <ModalBody>
          Êtes-vous sûr de vouloir supprimer cette catégorie ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Annuler
          </Button>
          <Button color="danger" onClick={handleDeleteCategory}>
            Supprimer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CategoryAdmin;
