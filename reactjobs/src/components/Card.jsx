import PropTypes from "prop-types";

const Card = ({ children, bg = "bg-gray-100" }) => {
	return (
		<>
			<div className={`${bg} p-6 rounded-lg shadow-md`}>{children}</div>
		</>
	);
};
Card.propTypes = {
	children: PropTypes.string.isRequired,
	bg: PropTypes.string.isRequired,
};

export default Card;
