import React from 'react';
import { Helmet } from 'react-helmet';

const DynamicMetadata = props => {

	const metadata = props.metadata;

	return (
		<Helmet>
			<title>{metadata.title}</title>
			<link rel="canonical" href={metadata.canonical} />
			{Object.entries(metadata.meta).map(([name, content]) => (
				<meta key={name} name={name} content={content} />
			))}
			{metadata.editors.map(name => (
				<meta key={name} name="DC.creator" content={name} />
			))}
		</Helmet>
	);
};

export default DynamicMetadata;