import { useState, useEffect, useCallback } from "react";
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
import Switch from "react-switch";
import Header from "components/Headers/Header.js";
import { FaTrash, FaEdit, FaPlus, FaUpload } from 'react-icons/fa';

const ServiceAdmin = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null); // Ajouté pour gérer l'ID du service sélectionné pour suppression
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    subCategory: '',
    price: '',
    location: '',
    availability: true,
    avatar: null,
  });
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const toggleModal = async (serviceId = null) => {
    if (serviceId) {
      setIsEditing(true);
      setSelectedServiceId(serviceId); // Stocker l'ID du service sélectionné pour édition
      try {
        const response = await axios.get(`http://localhost:9001/service/getServiceById/${serviceId}`);
        const service = response.data;

        await fetchSubCategoriesByCategoryId(service.subCategory.category);

        setNewService({
          title: service.title || '',
          description: service.description || '',
          subCategory: service.subCategory._id || '',
          price: service.price || '',
          location: service.location || '',
          availability: service.availability || true,
          avatar: null,
        });
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    } else {
      setIsEditing(false);
      setNewService({
        title: '',
        description: '',
        subCategory: '',
        price: '',
        location: '',
        availability: true,
        avatar: null,
      });
    }
    setModal(!modal);
  };

  const toggleDeleteModal = (serviceId = null) => {
    if (!deleteModal) {
      setSelectedServiceId(serviceId); // Stocker l'ID du service sélectionné pour suppression
    }
    setDeleteModal(!deleteModal);
  };

  const fetchServices = useCallback(async () => {
    try {
      let response;
      if (filterType === 'all') {
        response = await axios.get('http://localhost:9001/service/getAllService');
      } else if (filterType === 'bySubCategory' && selectedSubCategoryId) {
        response = await axios.get(`http://localhost:9001/service/getServiceBySubCategoryId/${selectedSubCategoryId}`);
      }

      if (response && response.data.length > 0) {
        const filteredServices = response.data.filter(service => !service.etatDelete);
        setServices(filteredServices);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  }, [filterType, selectedSubCategoryId]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:9001/category/getallcategories');
      const categoryData = response.data.map(category => ({
        value: category._id,
        label: category.name,
      }));
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchAllSubCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:9001/subcategory/getAllSubCategories');
      const subCategoryData = response.data
        .filter(subCategory => !subCategory.etatDelete)
        .map(subCategory => ({
          value: subCategory._id,
          label: subCategory.name,
        }));

      console.log('Sous-catégories récupérées :', subCategoryData);

      setSubCategories(subCategoryData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  }, []);

  const fetchSubCategoriesByCategoryId = useCallback(async (categoryId) => {
    try {
      setSubCategories([]);
      const response = await axios.get(`http://localhost:9001/subcategory/getSubCategoriesByCategoryId/${categoryId}`);
      const subCategoryData = response.data
        .filter(subCategory => !subCategory.etatDelete)
        .map(subCategory => ({
          value: subCategory._id,
          label: subCategory.name,
        }));

      setSubCategories(subCategoryData);
    } catch (error) {
      console.error('Error fetching subcategories by category:', error);
    }
  }, []);

  const handleAddOrUpdateService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newService).forEach(key => {
      if (newService[key] !== null && newService[key] !== '') {
        formData.append(key, newService[key]);
      }
    });

    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      if (isEditing) {
        await axios.put(`http://localhost:9001/service/updateService/${selectedServiceId}`, formData, { headers });
      } else {
        await axios.post('http://localhost:9001/service/addService', formData, { headers });
      }
      setModal(false);
      fetchServices();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} service:`, error);
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.patch(`http://localhost:9001/service/deleteService/${selectedServiceId}`);
      fetchServices();
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  useEffect(() => {
    fetchServices();

    if (filterType === 'bySubCategory') {
      fetchAllSubCategories();
    }
  }, [filterType, selectedSubCategoryId, fetchServices, fetchAllSubCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Gestion des Services</h3>
                <Button color="primary" onClick={() => toggleModal()} startIcon={<FaPlus />}>
                  Ajouter un Service
                </Button>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="filterSelect">Filtrer les Services</Label>
                  <Select
                    id="filterSelect"
                    options={[
                      { value: 'all', label: 'Tous les Services' },
                      { value: 'bySubCategory', label: 'Par Sous-Catégorie' },
                    ]}
                    onChange={(selectedOption) => {
                      setFilterType(selectedOption.value);
                      setSelectedSubCategoryId(null);
                      setSubCategories([]);
                    }}
                    placeholder="Filtrer les services..."
                  />
                  {filterType === 'bySubCategory' && (
                    <Select
                      id="subCategoryFilterSelect"
                      options={subCategories}
                      onChange={(selectedOption) => setSelectedSubCategoryId(selectedOption.value)}
                      placeholder="Choisir une sous-catégorie..."
                    />
                  )}
                </FormGroup>
                <Row>
                  {services.length > 0 ? (
                    services.map(service => (
                      <Col xs={12} sm={6} md={4} key={service._id} className="mb-4">
                        <Card className="shadow">
                          <CardBody className="text-center">
                            <img
                              src={`http://localhost:9001/images/service/${service.avatar}`}
                              alt={service.title}
                              style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '15px' }}
                            />
                            <h5>{service.title}</h5>
                            <p>{service.description}</p>
                            <p>Prix: {service.price} DT</p>
                            <p>Localisation: {service.location}</p>
                            <Button
                              color="info"
                              size="sm"
                              className="mr-2"
                              onClick={() => toggleModal(service._id)}
                            >
                              <FaEdit /> Modifier
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => toggleDeleteModal(service._id)}
                            >
                              <FaTrash /> Supprimer
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p className="text-center">Aucun service trouvé pour cette sous-catégorie.</p>
                  )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={() => toggleModal()}>
        <ModalHeader toggle={() => toggleModal()}>
          {isEditing ? 'Modifier le Service' : 'Ajouter un Service'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddOrUpdateService}>
            <FormGroup>
              <Label for="title">Titre du Service</Label>
              <Input
                type="text"
                id="title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="categorySelect">Sélectionner une Catégorie</Label>
              <Select
                id="categorySelect"
                options={categories}
                onChange={(selectedOption) => {
                  setNewService({ ...newService, subCategory: '' });
                  fetchSubCategoriesByCategoryId(selectedOption.value);
                }}
                placeholder="Choisir une catégorie..."
                value={categories.find(cat => cat.value === newService.subCategory)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="subCategorySelect">Sélectionner une Sous-Catégorie</Label>
              <Select
                id="subCategorySelect"
                options={subCategories}
                value={subCategories.find(subCat => subCat.value === newService.subCategory)}
                onChange={(selectedOption) => setNewService({ ...newService, subCategory: selectedOption.value })}
                placeholder="Choisir une sous-catégorie..."
                isDisabled={!subCategories.length}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Prix</Label>
              <Input
                type="number"
                id="price"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="title">Localisation</Label>
              <Input
                type="text"
                id="title"
                value={newService.location}
                onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="availability">Disponibilité</Label>
              <div>
                <Switch
                  id="availability"
                  onChange={(checked) => setNewService({ ...newService, availability: checked })}
                  checked={newService.availability}
                  onColor="#86d3ff"
                  onHandleColor="#2693e6"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={48}
                  className="react-switch"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="avatar-upload">Image du Service</Label>
              <div className="custom-file-upload">
                <input
                  type="file"
                  name="avatar"
                  id="avatar-upload"
                  onChange={(e) => setNewService({ ...newService, avatar: e.target.files[0] })}
                  style={{ display: 'none' }}
                />
                <Button
                  color="secondary"
                  onClick={() => document.getElementById('avatar-upload').click()}
                  startIcon={<FaUpload />}
                >
                  Choisir une image
                </Button>
                {newService.avatar && <span className="ml-2">{newService.avatar.name}</span>}
              </div>
            </FormGroup>
            <ModalFooter>
              <Button color="secondary" onClick={() => toggleModal()}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>

      <Modal isOpen={deleteModal} toggle={() => toggleDeleteModal()}>
        <ModalHeader toggle={() => toggleDeleteModal()}>
          Confirmer la Suppression
        </ModalHeader>
        <ModalBody>
          Êtes-vous sûr de vouloir supprimer ce service ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleDeleteModal()}>
            Annuler
          </Button>
          <Button color="danger" onClick={() => handleDeleteService()}>
            Supprimer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ServiceAdmin;
