import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = props => {
  const { store } = useGlobalReducer();

  const { theId } = useParams();
  const singleTask = store.tasks.find(task => task.id === parseInt(theId));

  return (
    <div className="container text-center">
      <h1 className="display-4">Task: {singleTask?.title}</h1>
      <hr className="my-4" />

      <Link to="/">
        <span className="btn btn-primary btn-lg" href="#" role="button">
          Back home
        </span>
      </Link>
    </div>
  );
};

Single.propTypes = {
  match: PropTypes.object
};
