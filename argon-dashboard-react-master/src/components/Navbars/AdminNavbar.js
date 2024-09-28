import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useAuth } from "../../AuthContext";

const AdminNavbar = (props) => {
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const isUserLayout = location.pathname.includes("/user/layout");

  const handleLogout = () => {
    logout(); 
    navigate("/auth/login"); 
  };

  const handleNavigateToUserLayout = () => {
    navigate("/user/layout");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          {!isUserLayout && (
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt={user?.userName || "User Avatar"}
                        src={
                          user?.avatar
                            ? `http://localhost:9001/images/users/${user.avatar}`
                            : require("../../assets/img/theme/team-4-800x800.jpg")
                        }
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {user?.userName || "User"}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-settings-gear-65" />
                    <span>Settings</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-calendar-grid-58" />
                    <span>Activity</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-support-16" />
                    <span>Support</span>
                  </DropdownItem>
                  {/* Bouton pour naviguer vers UserLayout */}
                  <DropdownItem href="#" onClick={handleNavigateToUserLayout}>
                    <i className="ni ni-settings" />
                    <span>Go to UserLayout</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="#pablo" onClick={handleLogout}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
};

// Ajouter la validation des props ici
AdminNavbar.propTypes = {
  brandText: PropTypes.string.isRequired, // Validation pour brandText
};

export default AdminNavbar;
