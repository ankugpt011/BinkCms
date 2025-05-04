import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Apptheme from '../../assets/theme/Apptheme';
import Scheduled from './components/Scheduled';
import DraftStory from './components/DraftStory';
import Published from './components/Published';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import VectorIcon from '../../assets/vectorIcons';
import DatePicker from 'react-native-date-picker';
import {debounce} from 'lodash';

import {
  AuthorList,
  AuthorListing,
  Create_Story_PageLayout,
  FetchStoryApi,
} from '../../apiServices/apiHelper';
import {useSelector} from 'react-redux';
import useApi from '../../apiServices/UseApi';
import SearchInput from '../../components/atoms/SearchInput';
import DropDownPicker from 'react-native-dropdown-picker';
import Private from './components/Private';
import SearchableDropdown from '../../components/atoms/SearchableDropDown';

const ViewStory = () => {
  // Initialize dates
  const [defaultFromDate, setDefaultFromDate] = useState(() => {
    const yesterday =   new Date(0)
    // yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [defaultToDate] = useState(new Date());

  // Filter states
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [FilterOption, setFilterOption] = useState(true);
  const [grid, setGrid] = useState(false);
  const [storyData, setStoryData] = useState([]);
  const userData = useSelector(state => state.login.userData);
  const [startIndex, setStartIndex] = useState(0);
  const [count, setCount] = useState(10);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('1_year'); // default value
  const [searchText, setSearchText] = useState('');
  const [authorSearchText, setAuthorSearchText] = useState('');
  const [authorResults, setAuthorResults] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Filter selection states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagItems, setTagItems] = useState([]);

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    category: null,
    search: '',
    tag: null,
    author: null,
    fromDate: defaultFromDate,
    toDate: defaultToDate,
  });

  // Time range options
  const [items, setItems] = useState([
    // {label: 'Today', value: 'today'},
    {label: '24 Hours', value: '24_hours'},
    {label: '1 Week', value: '1_week'},
    {label: '1 Month', value: '1_month'},
    {label: '1 Year', value: '1_year'},
    {label: 'All', value: 'all'},
  ]);

  // Data from Redux
  const categoriesData = useSelector(
    state => state.metaData.categories.categories,
  );
  const locationsData = useSelector(state => state.metaData.locations);
  const tagsData = useSelector(state => state.metaData.tags.tags);
  const {callApi} = useApi({method: 'GET', manual: true});

  // Update fromDate when time range selection changes
  useEffect(() => {
    const today = new Date();
    let newFromDate = new Date();

    switch (value) {
      case 'today':
        newFromDate.setHours(0, 0, 0, 0);
        break;
      case '24_hours':
        newFromDate.setHours(newFromDate.getHours() - 24);
        break;
      case '1_week':
        newFromDate.setDate(newFromDate.getDate() - 7);
        break;
      case '1_month':
        newFromDate.setMonth(newFromDate.getMonth() - 1);
        break;
      case '1_year':
        newFromDate.setFullYear(newFromDate.getFullYear() - 1);
        break;
      case 'all':
        // Set to a very old date or null depending on your API requirements
        newFromDate = new Date(0); // Unix epoch
        break;
      default:
        break;
    }

    setFromDate(newFromDate);
  }, [value]);

  // Transform categories data
  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      const validItems = categoriesData
        .filter(cat => cat?.name && cat?.catId != null)
        .map(cat => ({
          label: cat.name,
          value: String(cat.catId),
          originalData: cat,
        }));

      setCategoryItems(validItems);
    } else {
      setCategoryItems([]);
    }
  }, [categoriesData]);

  // Transform tags data
  useEffect(() => {
    if (tagsData && Array.isArray(tagsData)) {
      const validTagItems = tagsData
        .filter(tag => tag?.name && tag?.id != null)
        .map(tag => ({
          label: tag.name,
          value: String(tag.id),
          originalData: tag,
        }));

      setTagItems(validTagItems);
    } else {
      setTagItems([]);
    }
  }, [tagsData]);

  // Debounced author search
  const handleAuthorSearch = useCallback(
    debounce(async text => {
      if (!text) {
        setAuthorResults([]);
        return;
      }

      try {
        const response = await callApi(null, AuthorList(text));
        if (response?.authors) {
          const formatted = response.authors.map(author => ({
            label: author.name,
            value: author.userId,
            originalData: author,
          }));
          setAuthorResults(formatted);
          setShowAuthorDropdown(true);
        }
      } catch (error) {
        console.error('Author search error:', error);
        setAuthorResults([]);
      }
    }, 500),
    [],
  );

  const handleAuthorTextChange = text => {
    setAuthorSearchText(text);
    handleAuthorSearch(text);
  };

  const handleAuthorSelect = author => {
    setSelectedAuthor(author);
    setAuthorSearchText(author.label);
    setShowAuthorDropdown(false);
  };

  const handleClearAuthor = () => {
    setSelectedAuthor(null);
    setAuthorSearchText('');
    setAuthorResults([]);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchText('');
    handleClearAuthor();
    setValue('1_year'); // Reset to default time range
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);

    setAppliedFilters({
      category: null,
      search: '',
      tag: null,
      author: null,
      fromDate: defaultFromDate,
      toDate: defaultToDate,
    });
  };

  // Apply all filters
  const applyFilters = () => {
    setAppliedFilters({
      category: selectedCategory?.value || null,
      search: searchText,
      tag: selectedTag?.label || null,
      author: selectedAuthor?.value || null,
      fromDate,
      toDate,
    });
  };

  const Header = () => {
    return (
      <View style={[styles.header, {height: FilterOption ? 510 : 50}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[FontStyle.heading, {color: Apptheme.color.background}]}>
            NEWS
          </Text>
          <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            {/* Grid/List toggle buttons */}
            <TouchableOpacity
              onPress={() => setGrid(true)}
              style={[
                styles.gridButton,
                {
                  backgroundColor: grid
                    ? Apptheme.color.background
                    : 'transparent',
                },
              ]}>
              <VectorIcon
                material-community-icon
                name="grid-large"
                size={14}
                color={grid ? Apptheme.color.black : Apptheme.color.background}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGrid(false)}
              style={[
                styles.gridButton,
                {
                  backgroundColor: !grid
                    ? Apptheme.color.background
                    : 'transparent',
                },
              ]}>
              <VectorIcon
                material-community-icon
                name="format-list-bulleted"
                size={14}
                color={!grid ? Apptheme.color.black : Apptheme.color.background}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilterOption(!FilterOption)}
              style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
              <Text style={[FontStyle.title, {color: '#ffffff', fontSize: 12}]}>
                Filter
              </Text>
              <VectorIcon
                material-icon
                name="keyboard-arrow-down"
                color="#ffffff"
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>

        {FilterOption ? (
          <>
            <Gap m6 />
            {/* Date Range Selector */}
            <View style={styles.dateRangeContainer}>
              <TouchableOpacity
                onPress={() => setOpenFrom(true)}
                style={styles.dateButton}>
                <Text
                  style={[
                    FontStyle.titleSmall,
                    {color: Apptheme.color.background},
                  ]}>
                  From
                </Text>
                <Text
                  style={[
                    FontStyle.headingSmall,
                    {color: Apptheme.color.background},
                  ]}>
                  {fromDate.toLocaleDateString()}
                </Text>
                <VectorIcon
                  material-icon
                  name="calendar-today"
                  color="#ffffff"
                  size={12}
                />
              </TouchableOpacity>

              <Gap row m6 />

              <TouchableOpacity
                onPress={() => setOpenTo(true)}
                style={styles.dateButton}>
                <Text
                  style={[
                    FontStyle.titleSmall,
                    {color: Apptheme.color.background},
                  ]}>
                  To
                </Text>
                <Text
                  style={[
                    FontStyle.headingSmall,
                    {color: Apptheme.color.background},
                  ]}>
                  {toDate.toLocaleDateString()}
                </Text>
                <VectorIcon
                  material-icon
                  name="calendar-today"
                  color="#ffffff"
                  size={12}
                />
              </TouchableOpacity>
            </View>
            <Gap m3 />

            {/* Time Range Dropdown */}
            <View style={{zIndex:1000002}}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select Time Range"
              style={styles.dropdownPicker}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemLabelStyle={styles.dropdownItem}
              selectedItemLabelStyle={styles.dropdownSelectedItem}
              ArrowDownIconComponent={() => (
                <VectorIcon
                  material-icon
                  name="keyboard-arrow-down"
                  color="#ffffff"
                  size={18}
                />
              )}
              ArrowUpIconComponent={() => (
                <VectorIcon
                  material-icon
                  name="keyboard-arrow-up"
                  color="#ffffff"
                  size={18}
                />
              )}
              TickIconComponent={() => (
                <VectorIcon
                  material-icon
                  name="check"
                  color={Apptheme.color.primary}
                  size={18}
                />
              )}
            />
            </View>

            <Gap m8 />

            {/* Category Dropdown */}
            <SearchableDropdown
              data={categoryItems}
              placeholder="Search categories..."
              onSelect={setSelectedCategory}
              value={selectedCategory}
              searchText={selectedCategory?.label || ''}
              onClear={() => setSelectedCategory(null)}
            />

            {/* Author Search */}
            <View style={{position: 'relative', zIndex: 1000}}>
              <SearchInput
                placeholder="Author"
                value={authorSearchText}
                onChangeText={handleAuthorTextChange}
                onFocus={() =>
                  authorResults.length > 0 && setShowAuthorDropdown(true)
                }
              />

              {showAuthorDropdown && authorResults.length > 0 && (
                <View style={styles.authorDropdown}>
                  <FlatList
                    data={authorResults}
                    keyExtractor={item => item.value}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.authorItem}
                        onPress={() => handleAuthorSelect(item)}>
                        <Text style={styles.authorItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="always"
                    style={{maxHeight: 200}}
                  />
                </View>
              )}
            </View>
            <Gap m3 />

            {/* Other Search Inputs */}
            <SearchInput placeholder="Search by Credit" />
            <Gap m3 />

            <SearchInput
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
            />

            <Gap m3 />

            {/* Tags Dropdown */}
            <View style={{zIndex: 150}}>
              <SearchableDropdown
                data={tagItems}
                placeholder="Search tags..."
                onSelect={setSelectedTag}
                value={selectedTag}
                searchText={selectedTag?.label || ''}
                onClear={() => setSelectedTag(null)}
              />
            </View>

            <SearchInput placeholder="Created By" />
            <Gap m3 />

            {/* Action Buttons */}
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text
                style={[
                  FontStyle.labelMedium,
                  {color: Apptheme.color.primary},
                ]}>
                Apply
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}>
              <Text
                style={[
                  FontStyle.labelMedium,
                  {color: Apptheme.color.background},
                ]}>
                Clear Filter
              </Text>
            </TouchableOpacity>

            {/* Date Pickers */}
            <DatePicker
              modal
              open={openFrom}
              date={fromDate}
              mode="date"
              onConfirm={date => {
                setOpenFrom(false);
                setFromDate(date);
              }}
              onCancel={() => setOpenFrom(false)}
            />
            <DatePicker
              modal
              open={openTo}
              date={toDate}
              mode="date"
              onConfirm={date => {
                setOpenTo(false);
                setToDate(date);
              }}
              onCancel={() => setOpenTo(false)}
            />
          </>
        ) : null}
      </View>
    );
  };

  return (
    <Tabs.Container
      renderHeader={Header}
      headerContainerStyle={{elevation: 5, shadowOpacity: 0.2}}
      tabBarStyle={{height: 50}}
      tabBarItemStyle={{width: 100}}
      tabBarLabelStyle={styles.tabBarLabel}>
      <Tabs.Tab name="Draft-Story">
        <DraftStory
          grid={grid}
          fromDate={appliedFilters.fromDate}
          toDate={appliedFilters.toDate}
          FilterOption={FilterOption}
          category={appliedFilters.category}
          searched={appliedFilters.search}
          tag={appliedFilters.tag}
          author={appliedFilters.author}
        />
      </Tabs.Tab>

      <Tabs.Tab name="SCHEDULED">
        <Scheduled
          grid={grid}
          fromDate={appliedFilters.fromDate}
          toDate={appliedFilters.toDate}
          FilterOption={FilterOption}
          category={appliedFilters.category}
          searched={appliedFilters.search}
          tag={appliedFilters.tag}
          author={appliedFilters.author}
        />
      </Tabs.Tab>

      <Tabs.Tab name="Published">
        <Published
          grid={grid}
          fromDate={appliedFilters.fromDate}
          toDate={appliedFilters.toDate}
          FilterOption={FilterOption}
          category={appliedFilters.category}
          searched={appliedFilters.search}
          tag={appliedFilters.tag}
          author={appliedFilters.author}
        />
      </Tabs.Tab>

      <Tabs.Tab name="Private">
        <Private
          grid={grid}
          fromDate={appliedFilters.fromDate}
          toDate={appliedFilters.toDate}
          FilterOption={FilterOption}
          category={appliedFilters.category}
          searched={appliedFilters.search}
          tag={appliedFilters.tag}
          author={appliedFilters.author}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: Apptheme.color.primary,
    padding: Apptheme.spacing.marginHorizontal,
  },
  gridButton: {
    height: 20,
    aspectRatio: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  dateRangeContainer: {
    height: 36,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    backgroundColor: 'rgb(80,130,220)',
    borderRadius: 6,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dropdownPicker: {
    backgroundColor: 'rgb(80,130,220)',
    borderColor: 'transparent',
    borderRadius: 6,
    height: 32,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: Apptheme.color.background,
  },
  dropdownContainer: {
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'transparent',
  },
  dropdownItem: {
    color: Apptheme.color.black,
  },
  dropdownSelectedItem: {
    fontWeight: 'bold',
    color: Apptheme.color.black,
  },
  authorDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 3,
    maxHeight: 200,
    zIndex: 1001,
  },
  authorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  authorItemText: {
    color: '#333',
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    includeFontPadding: false,
    margin: 0,
    padding: 0,
    width: '100%',
    textAlign: 'center',
  },
});

export default ViewStory;
