// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useGlobalReducer from "../hooks/useGlobalReducer";

import rigoImage from "../assets/img/rigo-baby.svg";

export const Single = props => {
  const { store } = useGlobalReducer()
  const { theId } = useParams()
  const singleTodo = store.todos.find(todo => todo.id === parseInt(theId));

  return (
    <div className="container text-center">
      <h1 className="display-4">Todo: {singleTodo?.title}</h1>
      <div className="my-4">
        <img src={rigoImage} alt="rigo" style={{ maxWidth: "320px", width: "100%" }} />
      </div>
      <hr className="my-4" />
      <Link to="/">
        <span className="btn btn-primary btn-lg" href="#" role="button">Back home</span>
      </Link>
    </div>
  );
};

Single.propTypes = {
  match: PropTypes.object
};
