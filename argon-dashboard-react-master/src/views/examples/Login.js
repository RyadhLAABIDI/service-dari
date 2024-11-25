import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("login"); // Pour gérer les étapes : 'login', 'forgot', 'otp', 'reset'
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9001/admin/login", { email, password });
      if (response.data.status) {
        localStorage.setItem("token", response.data.token); // Stockage du token
        localStorage.setItem("role", response.data.role); // Stockage du rôle
        login(); // Mise à jour de l'état d'authentification
        navigate("/admin/index"); // Redirection vers le tableau de bord
      } else {
        setError(response.data.error); // Afficher l'erreur si l'utilisateur n'est pas autorisé
      }
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de la connexion.");
    }
  };

  const handleForgetPwd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9001/forgetPwd", { email });
      if (response.data.status) {
        setStep("otp"); 
      } else {
        setError(response.data.error); 
      }
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de l'envoi de l'email.");
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9001/otp", { data: otpCode });
      if (response.data.status) {
        localStorage.setItem("token", response.data.token); 
        setStep("reset"); 
      } else {
        setError(response.data.error); 
      }
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de la vérification du code.");
    }
  };

  const handleNewPwd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:9001/newPwd", { password: newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setStep("login"); 
        setError(""); 
      } else {
        setError(response.data.error); 
      }
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>{step === "login" ? "Sign in with" : step === "forgot" ? "Reset Password" : "Enter OTP"}</small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {step === "login" && (
              <Form role="form" onSubmit={handleLogin}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                {error && <div className="text-danger text-center">{error}</div>}
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id="customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Sign in
                  </Button>
                </div>
              </Form>
            )}

            {step === "forgot" && (
              <Form role="form" onSubmit={handleForgetPwd}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                {error && <div className="text-danger text-center">{error}</div>}
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Send OTP
                  </Button>
                  <Button className="btn-link" color="secondary" onClick={() => setStep("login")}>
                    Back to Login
                  </Button>
                </div>
              </Form>
            )}

            {step === "otp" && (
              <Form role="form" onSubmit={handleOtp}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Enter OTP"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                {error && <div className="text-danger text-center">{error}</div>}
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Verify OTP
                  </Button>
                </div>
              </Form>
            )}

            {step === "reset" && (
              <Form role="form" onSubmit={handleNewPwd}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                {error && <div className="text-danger text-center">{error}</div>}
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Reset Password
                  </Button>
                </div>
              </Form>
            )}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            {step === "login" && (
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault();
                  setStep("forgot"); // Activer la récupération de mot de passe en cliquant sur le lien
                }}
              >
                <small>Forgot password?</small>
              </a>
            )}
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
