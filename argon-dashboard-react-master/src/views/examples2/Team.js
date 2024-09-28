import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';
import axios from 'axios';
import WOW from 'wowjs'; // Import de WOW.js pour les animations
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome pour les icônes

const Team = () => {
    const [providers, setProviders] = useState([]);
    const carouselRef = useRef(null);
    const navigate = useNavigate(); // Pour naviguer vers le profil

    // Récupérer les providers et leurs services depuis l'API au montage du composant
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                // Récupérer tous les utilisateurs avec le rôle PROVIDER
                const response = await axios.get('http://localhost:9001/user');
                const providersData = response.data.filter(user => user.role === 'PROVIDER');

                // Récupérer les services pour chaque provider
                const providersWithServices = await Promise.all(providersData.map(async provider => {
                    try {
                        const serviceResponse = await axios.get(
                            `http://localhost:9001/service/getServiceByProvider?providerId=${provider._id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            }
                        );
                        const services = serviceResponse.data;
                        if (services.length > 0) {
                            provider.serviceTitle = services[0].title; // Associer le titre du premier service trouvé
                        } else {
                            provider.serviceTitle = 'No service available'; // Par défaut si aucun service n'est trouvé
                        }
                    } catch (error) {
                        console.error('Erreur lors de la récupération des services:', error);
                        provider.serviceTitle = 'Error fetching service';
                    }
                    return provider;
                }));

                setProviders(providersWithServices);
            } catch (error) {
                console.error('Erreur lors de la récupération des providers:', error);
            }
        };

        fetchProviders();
    }, []);

    // Initialiser Owl Carousel lorsque les providers sont chargés
    useEffect(() => {
        if (providers.length > 0) {
            const $carousel = $(carouselRef.current);
            $carousel.owlCarousel({
                loop: true,
                margin: 10,
                nav: false, // Désactive les flèches intégrées d'Owl Carousel
                dots: true,
                autoplay: true,
                autoplayTimeout: 3000,
                autoplayHoverPause: true,
                items: 4, // Nombre d'items par défaut
                responsive: {
                    0: {
                        items: 1,
                    },
                    576: {
                        items: 2,
                    },
                    768: {
                        items: 3,
                    },
                    992: {
                        items: 4,
                    },
                },
            });

            // Nettoyer l'instance Owl Carousel lors du démontage du composant
            return () => {
                $carousel.trigger('destroy.owl.carousel');
            };
        }
    }, [providers]);

    useEffect(() => {
        // Initialiser WOW.js pour les animations
        new WOW.WOW().init();
    }, []);

    // Fonctions pour naviguer manuellement dans le carrousel
    const handleNext = () => {
        $(carouselRef.current).trigger('next.owl.carousel');
    };

    const handlePrev = () => {
        $(carouselRef.current).trigger('prev.owl.carousel');
    };

    // Redirection vers le profil du provider
    const handleCardClick = (providerId) => {
        navigate(`/provider/provider/${providerId}/profile`);
    };

    // Styles en ligne pour le message au survol
    const messageStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
        zIndex: 10
    };

    const teamItemStyle = {
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden'
    };

    return (
        <div>
            {/* En-tête de la page */}
            <div className="container-fluid page-header mb-5 py-5">
                <div className="container">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Technicians</h1>
                    <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb text-uppercase">
                            <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Technicians</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Section des Technicians */}
            <div className="container-xxl py-5">
                <div className="container">
                    {/* Titre de la section */}
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="text-secondary text-uppercase">Our Technicians</h6>
                        <h1 className="mb-5">Our Expert Technicians</h1>
                    </div>
                    
                    {/* Carrousel Owl */}
                    <div
                        ref={carouselRef}
                        className="owl-carousel team-carousel position-relative wow fadeInUp"
                        data-wow-delay="0.1s"
                    >
                        {providers.length > 0 ? (
                            providers.map((provider, index) => (
                                <div 
                                    key={provider._id || index} 
                                    className="team-item"
                                    onClick={() => handleCardClick(provider._id)}
                                    style={teamItemStyle}
                                >
                                    <div className="position-relative overflow-hidden">
                                        <img
                                            className="img-fluid"
                                            src={`http://localhost:9001/images/users/${provider.avatar}`}
                                            alt={`Provider ${provider.userName}`}
                                        />
                                    </div>
                                    <div className="team-text">
                                        <div className="bg-light p-2">
                                            <h5 className="fw-bold mb-0">{provider.userName}</h5>
                                            <small>Technician</small>
                                        </div>
                                        <div className="bg-primary p-2">
                                            <p className="text-white mb-0">Service: {provider.serviceTitle}</p>
                                        </div>
                                    </div>
                                    {/* Message au survol */}
                                    <div style={messageStyle}>
                                        Cliquez pour trouver le Profile !
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Aucun provider disponible pour le moment.</p>
                        )}
                    </div>
                    
                    {/* Flèches de navigation personnalisées */}
                    {providers.length > 4 && (
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-primary custom-prev mx-2"
                                onClick={handlePrev}
                                style={{
                                    position: 'relative',
                                    zIndex: 1000,
                                }}
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            <button
                                className="btn btn-primary custom-next mx-2"
                                onClick={handleNext}
                                style={{
                                    position: 'relative',
                                    zIndex: 1000,
                                }}
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Style pour le hover */}
            <style>
                {`
                    .team-item {
                        position: relative;
                    }
                    .team-item:hover .hover-message {
                        opacity: 1;
                    }
                `}
            </style>
        </div>
    );
};

export default Team;
