import React from "react";

import styles from './Lemma.module.css';

function PublicLabelledText(props) {

  if (!props.content) {
		return null;
	}

	// content may be a React object (NewLineText), which may have an empty text prop – CDC (no date)
	// The original version of this condition also excluded publications wrapped in anchor tags
	// (linked publications), adding the inner condition avoids this problem – CDC 09.12.2024
	if (React.isValidElement(props.content)) {
		if (props.content.type !== 'a' && !props.content.props.text)
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