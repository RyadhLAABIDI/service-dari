import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "reactstrap";
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
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from 'react-select';
import Header from "components/Headers/Header.js";
import { FaTrash, FaPlus, FaUpload } from 'react-icons/fa';

const SubCategoryAdmin = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  // Fonction pour récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:9001/category/getallcategories');
      const allCategories = response.data.map(category => ({
        value: category._id,
        label: category.name,
      }));
      setCategories([{ value: 'all', label: 'Toutes les sous-catégories' }, ...allCategories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fonction pour récupérer toutes les sous-catégories
  const fetchAllSubCategories = async () => {
    try {
      const response = await axios.get('http://localhost:9001/subcategory/getallsubcategories');
      setSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fonction pour récupérer les sous-catégories par ID de catégorie
  const fetchSubCategoriesByCategoryId = async (categoryId) => {
    try {
      if (categoryId === 'all') {
        fetchAllSubCategories();
      } else {
        const response = await axios.get(`http://localhost:9001/subcategory/getSubCategoriesByCategoryId/${categoryId}`);
        if (response.data.length === 0) {
          setSubCategories([]);
        } else {
          setSubCategories(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories([]);
    }
  };

  // Fonction pour ajouter une nouvelle sous-catégorie
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newSubCategory);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      await axios.post(`http://localhost:9001/subcategory/addSubCategory/${selectedCategoryId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewSubCategory('');
      setAvatar(null);
      fetchSubCategoriesByCategoryId(selectedCategoryId); // Refresh subcategories after adding
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  // Fonction pour marquer une sous-catégorie comme supprimée
  const handleDeleteSubCategory = async () => {
    try {
      await axios.patch(`http://localhost:9001/subcategory/deletecategories/${selectedSubCategoryId}`);
      fetchSubCategoriesByCategoryId(selectedCategoryId); // Refresh subcategories after deletion
      toggleModal(); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  // Ouvre le dialogue de confirmation de suppression
  const toggleModal = (subcategoryId = null) => {
    setSelectedSubCategoryId(subcategoryId);
    setModal(!modal);
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
    fetchAllSubCategories(); // Fetch all subcategories on component mount
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Gestion des Sous-Catégories</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleAddSubCategory}>
                  <FormGroup>
                    <Label for="categorySelect">Sélectionner une Catégorie</Label>
                    <Select
                      id="categorySelect"
                      options={categories}
                      value={categories.find(cat => cat.value === selectedCategoryId)}
                      onChange={(selectedOption) => {
                        setSelectedCategoryId(selectedOption.value);
                        if (selectedOption.value === '' || selectedOption.value === 'all') {
                          fetchAllSubCategories(); // Fetch all subcategories if "All" is selected
                        } else {
                          fetchSubCategoriesByCategoryId(selectedOption.value);
                        }
                      }}
                      placeholder="Choisir une catégorie..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="subcategoryName">Nom de la Sous-Catégorie</Label>
                    <Input
                      type="text"
                      name="subcategoryName"
                      id="subcategoryName"
                      placeholder="Entrer le nom de la sous-catégorie"
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="avatar-upload">Image de la Sous-Catégorie</Label>
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
                    Ajouter Sous-Catégorie
                  </Button>
                </Form>
                <hr />
                <h4 className="mb-4">Liste des Sous-Catégories</h4>
                {subCategories.length > 0 ? (
                  <Row>
                    {subCategories.map((subcategory) => (
                      <Col xs={12} sm={6} md={4} key={subcategory._id} className="mb-4">
                        <Card className="shadow">
                          <CardBody className="text-center">
                            <img
                              src={`http://localhost:9001/images/subcategory/${subcategory.avatar}`}
                              alt={subcategory.name}
                              style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '15px' }}
                            />
                            <h5>{subcategory.name}</h5>
                            <Button color="danger" size="sm" onClick={() => toggleModal(subcategory._id)}>
                              <FaTrash /> Supprimer
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-center text-muted">Aucune sous-catégorie disponible pour cette catégorie pour le moment.</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirmer la Suppression</ModalHeader>
        <ModalBody>
          Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Annuler
          </Button>
          <Button color="danger" onClick={handleDeleteSubCategory}>
            Supprimer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SubCategoryAdmin;
