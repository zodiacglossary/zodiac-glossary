import React from 'react';
import { Font, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

Font.register({
	family: 'EB Garamond',
  fonts: [
    {
      src: '/fonts/EBGaramond-Regular.ttf',
    },
    {
      src: '/fonts/EBGaramond-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/EBGaramond-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});
Font.register({
  family: 'Symbola',
  fonts: [
    {
      src: '/fonts/Symbola.ttf',
    },
  ],
});
Font.register({
  family: 'New Athena Unicode',
  fonts: [
    {
      src: '/fonts/new_athena_unicode.ttf',
    },
  ],
});
Font.register({
  family: 'NotoSansEgyptian',
  fonts: [
    {
      src: '/fonts/NotoSansEgyptianHieroglyphs-Regular.ttf',
    },
  ],
});
Font.register({
  family: 'All Sorts',
  fonts: [
    {
      src: '/fonts/merged.ttf',
    },
  ],
});
Font.register({
  family: 'Ezra',
  fonts: [
    {
      src: '/fonts/SILEOT.ttf',
    },
  ],
});
Font.register({
  family: 'EOT',
  fonts: [
    {
      src: '/fonts/JSeshFont.ttf',
    },
  ],
});
Font.register({
  family: 'yahei',
  fonts: [
    {
      src: '/fonts/2002.ttf',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    // border: '1px solid #ccc',
  },
  garamond: {
    fontFamily: 'All Sorts',
    fontSize: 14,
  },
  symbola: {
    fontFamily: 'Symbola',
    fontSize: 14,
  },
  new_athena: {
    fontFamily: 'New Athena Unicode',
    fontSize: 14,
  },
  egyptian: {
    fontFamily: 'EOT',
    fontSize: 14,
  },
  hebrew: {
    fontFamily: 'Ezra',
    fontSize: 14,
  },
  chinese: {
    fontFamily: 'yahei',
    fontSize: 14,
  },
});

// PDFDocument component
const PDFDocument = props => {
  const searchResults = props.searchResults;
  console.log(searchResults)

  if (searchResults) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.garamond}>
              This is a PDF generated using @react-pdf/renderer with EB Garamond font.
            </Text>
            <Text style={styles.garamond}>
              abeliakos |  ἀβελιακός | solar
            </Text>
            <Text style={styles.hebrew}>
            בֹּקֶר 
            </Text>
            <Text style={styles.garamond}>
              ⲁ ⲃ ⲅ ⲇ ⲉ ⲍ ⲏ ⲑ ⲓ 分離
            </Text>
            <Text style={styles.chinese}>
            𠌦
            </Text>
            <Text style={styles.egyptian}>
              𓆓分離
            </Text>
            <Text style={styles.garamond}>
              😀😀
            </Text>
            <Text style={styles.symbola}>
              😀
            </Text>
            {searchResults.map(searchResult => (
              <Text style={styles.symbola} key={searchResult.lemma_id}>
                {searchResult.disp_original}
              </Text>
            ))}
          </View>
        </Page>
      </Document>
    );
  }
  return <></>;
}

export default PDFDocument;
