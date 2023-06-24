import sharedStyles from './sharedStyles';

// Replicates React Native's SectionList API in the browser with no virtualization
export default function SectionList({
  sections,
  sectionKeyExtractor,
  itemKeyExtractor,
  contentContainerStyle,
  renderSectionHeader,
  renderItem,
  ListEmptyComponent = null,
}) {
  return (
    <div style={{...styles.container, ...contentContainerStyle}}>
      {sections.length === 0
        ? ListEmptyComponent
        : sections.map(section => (
            <div key={sectionKeyExtractor(section)}>
              {/*Replace with a section key extractor*/}
              {renderSectionHeader({section})}
              {section.data.map((item, index) => (
                <div key={itemKeyExtractor(item)} style={sharedStyles.column}>
                  {renderItem({item, section, index})}
                </div>
              ))}
            </div>
          ))}
    </div>
  );
}

const styles = {
  container: {
    overflowY: 'auto',
  },
};
