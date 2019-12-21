import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { showModal } from "../../actions/modal";

const Education = ({ education, showModal }) => {
	const onClick = id => {
		const resourceType = "education";
		showModal(
			`Are you sure? You want to delete this ${resourceType}.`,
			resourceType,
			id,
		);
	};
	const educations = education.map(edu => (
		<tr key={edu._id}>
			<td>{edu.school}</td>
			<td className="hide-sm">{edu.degree}</td>
			<td>
				<Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
				{edu.to === null ? (
					"Current"
				) : (
					<Moment format="YYYY/MM/DD">{edu.to}</Moment>
				)}
			</td>
			<td>
				<button
					onClick={() => {
						onClick(edu._id);
					}}
					className="btn btn-danger">
					<i className="fa fa-trash"></i>
				</button>
			</td>
		</tr>
	));
	return (
		<Fragment>
			<h2 className="my2">Education Credentials</h2>
			<table className="table">
				<thead>
					<tr>
						<th>Institute</th>
						<th className="hide-sm">Degree</th>
						<th className="hide-sm">Years</th>
						<th />
					</tr>
				</thead>
				<tbody>{educations}</tbody>
			</table>
		</Fragment>
	);
};

Education.propTypes = {
	education: PropTypes.array.isRequired,
	showModal: PropTypes.func.isRequired,
};

export default connect(null, { showModal })(Education);
