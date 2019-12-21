import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

import { connect } from "react-redux";
import { showModal } from "../../actions/modal";

const Experience = ({ experience, showModal }) => {
	const onClick = id => {
		const resourceType = "experience";
		showModal(
			`Are you sure? You want to delete this ${resourceType}.`,
			resourceType,
			id,
		);
	};
	const experiences = experience.map(exp => (
		<tr key={exp._id}>
			<td>{exp.company}</td>
			<td className="hide-sm">{exp.title}</td>
			<td>
				<Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
				{exp.to === null ? (
					"Current"
				) : (
					<Moment format="YYYY/MM/DD">{exp.to}</Moment>
				)}
			</td>
			<td>
				<button onClick={() => onClick(exp._id)} className="btn btn-danger">
					<i className="fa fa-trash"></i>
				</button>
			</td>
		</tr>
	));
	return (
		<Fragment>
			<h2 className="my2">Experience Credentials</h2>
			<table className="table">
				<thead>
					<tr>
						<th>Company</th>
						<th className="hide-sm">Title</th>
						<th className="hide-sm">Years</th>
						<th />
					</tr>
				</thead>
				<tbody>{experiences}</tbody>
			</table>
		</Fragment>
	);
};

Experience.propTypes = {
	experience: PropTypes.array.isRequired,
	showModal: PropTypes.func.isRequired,
};

export default connect(null, { showModal })(Experience);
