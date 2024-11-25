import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import WOW from 'wowjs';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [showSubCategories, setShowSubCategories] = useState(true);
  const [activeSubCategoryForm, setActiveSubCategoryForm] = useState(null);
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState(''); // Variable to store the selected subcategory name
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    availability: false,
    location: '',
    avatar: null,
  });

  const [autoPlayCategory, setAutoPlayCategory] = useState(true);
  const [autoPlaySubCategory, setAutoPlaySubCategory] = useState(true);

  const carouselRef = useRef(null);
  const subCategoriesCarouselRef = useRef(null);

  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9001/category/getAllParentCategoriesWithSubcategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  const destroyCarousel = (ref) => {
    const $carousel = $(ref.current);
    if ($carousel.data('owl.carousel')) {
      $carousel.trigger('destroy.owl.carousel');
      $carousel.find('.owl-stage-outer').children().unwrap();
    }
  };

  const initializeOwlCarousel = (ref, itemsCount, autoPlay) => {
    const $carousel = $(ref.current);
    $carousel.owlCarousel({
      loop: itemsCount > 3,
      margin: 20,
      nav: true, 
      navText: [
        '<i class="fa fa-chevron-left"></i>', 
        '<i class="fa fa-chevron-right"></i>'
      ],
      dots: true,
      autoplay: autoPlay,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      items: Math.min(itemsCount, 4),
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
    });
  };

  useEffect(() => {
    if (categories.length > 0) {
      destroyCarousel(carouselRef);
      initializeOwlCarousel(carouselRef, categories.length, autoPlayCategory);
    }
  }, [categories, autoPlayCategory]);

  useEffect(() => {
    if (subCategories.length > 0) {
      destroyCarousel(subCategoriesCarouselRef);
      initializeOwlCarousel(subCategoriesCarouselRef, subCategories.length, autoPlaySubCategory);
    }
  }, [subCategories, autoPlaySubCategory]);

  useEffect(() => {
    new WOW.WOW().init();
  }, []);

  const toggleSubCategories = async (categoryId, subCategories) => {
    destroyCarousel(subCategoriesCarouselRef);

    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setSubCategories([]);
    } else {
      setActiveCategory(categoryId);
      setSubCategories(subCategories);
      setShowSubCategories(true);
    }
  };

  const handleSubCategoryClick = (subCategoryId, subCategoryName) => {
    setActiveSubCategoryForm(subCategoryId === activeSubCategoryForm ? null : subCategoryId);
    setSelectedSubCategoryName(subCategoryName); // Set the selected subcategory name
    setFormData({
      title: '',
      description: '',
      price: '',
      availability: false,
      location: '',
      avatar: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleFormSubmit = async (e, subCategoryId) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('availability', formData.availability);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('avatar', formData.avatar);
    formDataToSend.append('subCategory', subCategoryId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:9001/service/addService', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        setActiveSubCategoryForm(null);
        setFormData({
          title: '',
          description: '',
          price: '',
          availability: false,
          location: '',
          avatar: null,
        });
      } else {
        console.error('Erreur lors de la création du service:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création du service:', error.message);
    }
  };

  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    height: '300px',
    margin: 'auto',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  };

  const categoryHoveredCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const subCategoryHoveredCardStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  };

  const messageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
    fontSize: '16px',
    zIndex: 3,
    textAlign: 'center',
    pointerEvents: 'none',
  };

  const categoryBackground = {
    background: 'linear-gradient(135deg, #000000, #434343)',
    padding: '20px',
    borderRadius: '10px',
  };

  const subCategoryBackground = {
    background: 'linear-gradient(135deg, #434343, #7F00FF)',
    padding: '20px',
    borderRadius: '10px',
  };

  const StyledButton = styled(Button)({
    background: 'linear-gradient(135deg, #1D976C, #93F9B9)',
    borderRadius: '50px',
    padding: '8px 16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
  });

  const modernFormStyle = {
    background: 'linear-gradient(135deg, #000000, #1e3c72, #2a5298)', // Gradient from black to shades of blue
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // Strong 3D shadow
    color: '#ffffff', // White text color
    marginTop: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    transform: 'translateZ(0)', // 3D effect
  };

  return (
    <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s" style={categoryBackground}>
      <div className="text-center mb-5">
        <h6 className="text-secondary text-uppercase">Our Categories</h6>
        <h1 className="display-5">Explore Our Categories</h1>
      </div>

      <div ref={carouselRef} className="owl-carousel category-carousel position-relative wow fadeInUp" data-wow-delay="0.1s">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className={`item card shadow category-card`}
              onClick={() => toggleSubCategories(category._id, category.SubCategory)}
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                ...cardStyle,
                ...(hoveredCategory === category._id ? categoryHoveredCardStyle : {}),
                cursor: 'pointer',
              }}
            >
              <img
                src={`http://localhost:9001/images/category/${category.avatar}`}
                alt={category.name}
                style={imageStyle}
              />
              <div style={contentStyle}>
                <h5 className="card-title" style={{ ...titleStyle, fontSize: '24px' }}>{category.name}</h5>

                <h6 style={{ color: '#007bff', marginTop: '10px', fontSize: '18px' }}>Liste des sous-catégories :</h6>

                {category.SubCategory && category.SubCategory.length > 0 ? (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {category.SubCategory.map((subCategory) => (
                      <li key={subCategory._id} style={{ fontSize: '16px', marginTop: '5px', color: '#007bff' }}>
                        {subCategory.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '16px', color: '#aaa', marginTop: '10px' }}>
                    Il n&rsquo;y a pas de sous-catégories disponibles pour le moment.
                  </p>
                )}
              </div>
              {hoveredCategory === category._id && (
                <div style={messageStyle}>
                  Cliquez pour trouver les sous-catégories !
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucune catégorie disponible pour le moment.</p>
        )}
      </div>

      <div className="text-center mt-3">
        <i
          className={`fas ${autoPlayCategory ? 'fa-toggle-on' : 'fa-toggle-off'}`}
          onClick={() => setAutoPlayCategory(!autoPlayCategory)}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: autoPlayCategory ? '#28a745' : '#dc3545',
          }}
          title={autoPlayCategory ? 'Fermer le glissage auto' : 'Ouvrir le glissage auto'}
        ></i>
      </div>

      {categories.length > 3 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-primary custom-prev mx-2"
            onClick={() => $(carouselRef.current).trigger('prev.owl.carousel')}
            style={{
              position: 'relative',
              zIndex: 1000,
            }}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            className="btn btn-primary custom-next mx-2"
            onClick={() => $(carouselRef.current).trigger('next.owl.carousel')}
            style={{
              position: 'relative',
              zIndex: 1000,
            }}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}

      {subCategories.length > 0 && showSubCategories && (
        <div className="mt-5" style={subCategoryBackground}>
          <div className="text-center mb-5">
            <h6 className="text-secondary text-uppercase">Sous-Catégories DISPONIBLES POUR LA CATÉGORIE :</h6>
            <h1 className="display-5">{categories.find((cat) => cat._id === activeCategory)?.name}</h1>
          </div>
          <div ref={subCategoriesCarouselRef} className="owl-carousel sub-category-carousel position-relative wow fadeInUp" data-wow-delay="0.1s">
            {subCategories.map((sub) => (
              <div
                key={sub._id}
                className={`item card shadow subcategory-card`}
                onClick={() => handleSubCategoryClick(sub._id, sub.name)}
                onMouseEnter={() => setHoveredSubCategory(sub._id)}
                onMouseLeave={() => setHoveredSubCategory(null)}
                style={{
                  ...cardStyle,
                  ...(hoveredSubCategory === sub._id ? subCategoryHoveredCardStyle : {}),
                  cursor: 'pointer',
                }}
              >
                <img
                  src={`http://localhost:9001/images/subcategory/${sub.avatar}`}
                  alt={sub.name}
                  style={imageStyle}
                />
                <div style={contentStyle}>
                  <h5 className="card-title" style={titleStyle}>{sub.name}</h5>
                </div>
                {hoveredSubCategory === sub._id && (
                  <div style={messageStyle}>
                    Cliquez pour créer un service !
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Display the form outside the carousel */}
          {activeSubCategoryForm && (
            <Box component="form" onSubmit={(e) => handleFormSubmit(e, activeSubCategoryForm)} sx={modernFormStyle}>
              <Typography variant="h6" gutterBottom>
                Ajouter un service pour la sous-catégorie: {selectedSubCategoryName}
              </Typography>
              <TextField
                label="Titre du Service"
                variant="outlined"
                fullWidth
                margin="normal"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
                InputProps={{ style: { color: '#ffffff' } }} // White input text color
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
                InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
                InputProps={{ style: { color: '#ffffff' } }} // White input text color
              />
              <TextField
                label="Prix"
                variant="outlined"
                fullWidth
                margin="normal"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                type="number"
                InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
                InputProps={{ style: { color: '#ffffff' } }} // White input text color
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.availability}
                    onChange={handleInputChange}
                    name="availability"
                    sx={{ color: '#ffcc00' }} // Yellow checkbox color
                  />
                }
                label="Disponibilité"
                sx={{ color: '#ffcc00' }} // Yellow label text color
              />
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                margin="normal"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                InputLabelProps={{ style: { color: '#ffcc00' } }} // Yellow label color
                InputProps={{ style: { color: '#ffffff' } }} // White input text color
              />
              <TextField
                type="file"
                fullWidth
                margin="normal"
                name="avatar"
                onChange={handleFileChange}
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#ffcc00' }, // Yellow label color
                }}
                inputProps={{
                  accept: 'image/*',
                  style: { color: '#ffffff' }, // White input text color
                }}
              />
              <div className="text-center mt-4">
                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    background: 'linear-gradient(135deg, #56CCF2, #2F80ED)',
                  }}
                >
                  Confirmer
                </StyledButton>
                <StyledButton
                  type="button"
                  onClick={() => setActiveSubCategoryForm(null)}
                  sx={{
                    background: 'linear-gradient(135deg, #EB5757, #000000)',
                    marginLeft: '16px',
                  }}
                >
                  Annuler
                </StyledButton>
              </div>
            </Box>
          )}

          <div className="text-center mt-3">
            <i
              className={`fas ${autoPlaySubCategory ? 'fa-toggle-on' : 'fa-toggle-off'}`}
              onClick={() => setAutoPlaySubCategory(!autoPlaySubCategory)}
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                color: autoPlaySubCategory ? '#28a745' : '#dc3545',
              }}
              title={autoPlaySubCategory ? 'Fermer le glissage auto' : 'Ouvrir le glissage auto'}
            ></i>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-secondary custom-prev mx-2"
              onClick={() => $(subCategoriesCarouselRef.current).trigger('prev.owl.carousel')}
              style={{
                position: 'relative',
                zIndex: 1000,
              }}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-secondary custom-next mx-2"
              onClick={() => $(subCategoriesCarouselRef.current).trigger('next.owl.carousel')}
              style={{
                position: 'relative',
                zIndex: 1000,
              }}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
