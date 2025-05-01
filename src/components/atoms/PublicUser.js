import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { debounce } from 'lodash';
import useApi from '../../apiServices/UseApi';
import { AuthorList } from '../../apiServices/apiHelper';




const PublicUser = ({
  value,
  onSelect,
  placeholder = 'Search authors...',
  style = {},
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [focus, setFocus] = useState(false);

  const { callApi } = useApi({ method: 'GET', manual: true });

  const handleSearch = useCallback(
    debounce(async (text) => {
      if (!text) return;
      const response = await callApi(null, AuthorList(text));
      if (response?.authors) {
        const formatted = response.authors.map(author => ({
          label: `${author.name}`,
          value: author.userId,
          raw: author,
        }));
        setSearchResults(formatted);
      }
    }, 400),
    []
  );

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        data={searchResults}
        labelField="label"
        valueField="value"
        value={value?.userId}
        search
        searchPlaceholder={placeholder}
        placeholder={placeholder}
        style={styles.dropdown}
        inputSearchStyle={styles.searchInput}
        selectedTextStyle={styles.selectedText}
        itemTextStyle={styles.itemText}
        onChangeText={handleSearch}
        onChange={(item) => onSelect(item.raw)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        isFocus={focus}
        maxHeight={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    color: '#000',
    fontSize: 14,
  },
  selectedText: {
    color: '#000',
  },
  itemText: {
    color: '#000',
  },
});

export default PublicUser;
