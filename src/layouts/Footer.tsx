import "./footer.css";
import logo from "../assets/icons/logo-white.png";

export const Footer: React.FC = () => {
  return (
    <footer>
      <div>
        <img src={logo} alt="logo" />
        <p>All Rights Reserved | skillupmentor.com</p>
      </div>
    </footer>
  );
};
