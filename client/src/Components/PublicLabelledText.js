import React from "react";

import styles from './Lemma.module.css';

function PublicLabelledText(props) {
  if (!props.content) {
		return null;
	}

	// content may be a React object (NewLineText), which may have an empty text prop
	if (props.content.props && !props.content.props.text) {
		return null;
	}

	return (
		<div className={styles.row}>
			<div className={styles.label}>{props.label}</div>
			<div className={styles.label} style={props.style}>{props.content}</div>
		</div>
	);
}

export default PublicLabelledText;