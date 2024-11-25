import { useState, useEffect, useCallback } from "react"; // Suppression de l'importation de React
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
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { FaBan, FaUnlock } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [action, setAction] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      // Filtrer les utilisateurs par rôles USER et PROVIDER
      const response = await axios.get("http://localhost:9001/user", {
        params: {
          roles: 'USER,PROVIDER',
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  }, []);

  const toggleModal = (user = null, actionType = '') => {
    setSelectedUser(user);
    setAction(actionType);
    setModal(!modal);
  };

  const handleBanOrUnbanUser = async () => {
    try {
      const endpoint = action === 'ban' ? "ban" : "unBan";
      await axios.put(`http://localhost:9001/user/${endpoint}`, {
        userId: selectedUser._id,
      });
      fetchUsers();
      setModal(false);
    } catch (error) {
      console.error(`Erreur lors de ${action === 'ban' ? 'bannissement' : 'débannissement'} de l'utilisateur:`, error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Gestion des Utilisateurs</h3>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Photo</th>
                      <th scope="col">Nom d&apos;utilisateur</th>
                      <th scope="col">Email</th>
                      <th scope="col">Téléphone</th>
                      <th scope="col">Rôle</th>
                      <th scope="col">Statut</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>
                          <img
                            src={`http://localhost:9001/images/users/${user.avatar}`}
                            alt={user.userName}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.banned ? (
                            <span className="text-danger">Banni</span>
                          ) : (
                            <span className="text-success">Actif</span>
                          )}
                        </td>
                        <td className="text-right">
                          {user.banned ? (
                            <Button
                              color="success"
                              size="sm"
                              onClick={() => toggleModal(user, 'unban')}
                            >
                              <FaUnlock /> Débannir
                            </Button>
                          ) : (
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => toggleModal(user, 'ban')}
                            >
                              <FaBan /> Bannir
                            </Button>
                          )}
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

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {action === 'ban' ? 'Confirmer le Bannissement' : 'Confirmer le Débannissement'}
        </ModalHeader>
        <ModalBody>
          Êtes-vous sûr de vouloir {action === 'ban' ? 'bannir' : 'débannir'} {selectedUser?.userName} ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(!modal)}>
            Annuler
          </Button>
          <Button color="primary" onClick={handleBanOrUnbanUser}>
            Confirmer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Users;
