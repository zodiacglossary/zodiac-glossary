import React from "react";

function PublicLabelledText(props) {
  if (!props.content) {
		return null;
	}

	// content may be a React object (NewLineText), which may have an empty text prop
	if (props.content.props && !props.content.props.text) {
		return null;
	}

	return (
		<tr>
			<td>
				<div>{props.label}</div>
			</td>
			<td>
				<div style={props.style}>{props.content}</div>
			</td>
		</tr>
	);
}

export default PublicLabelledText;
