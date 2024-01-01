import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export const Shop = () => {
    return (
        <h2>
            This is the Shopping Center
        <Link to={'/checkout'}>
          <FontAwesomeIcon icon={faCartShopping} className="link" />
        </Link>

        </h2>
    );
};
