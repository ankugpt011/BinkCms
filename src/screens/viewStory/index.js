import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon
import Apptheme from '../../assets/theme/Apptheme';
import Scheduled from './components/Scheduled';
import DraftStory from './components/DraftStory';
import Published from './components/Published';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import VectorIcon from '../../assets/vectorIcons';
import DatePicker from 'react-native-date-picker';

import {Create_Story_PageLayout, FetchStoryApi} from '../../apiServices/apiHelper';
import {useSelector} from 'react-redux';
import useApi from '../../apiServices/UseApi';
import SearchInput from '../../components/atoms/SearchInput';
import DropDownPicker from 'react-native-dropdown-picker';

const ViewStory = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
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
  const [items, setItems] = useState([
    {label: 'Today', value: 'today'},
    {label: '24 Hours', value: '24_hours'},
    {label: '1 Week', value: '1_week'},
    {label: '1 Month', value: '1_month'},
    {label: '1 Year', value: '1_year'},
    {label: 'All', value: 'all'},
  ]);

  


  console.log('userData', userData);

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
            <TouchableOpacity
              onPress={() => setGrid(true)}
              style={{
                height: 20,
                aspectRatio: 1,
                backgroundColor: grid
                  ? Apptheme.color.background
                  : 'transparent',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
              }}>
              <VectorIcon
                material-community-icon
                name="grid-large"
                size={14}
                color={grid ? Apptheme.color.black : Apptheme.color.background}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGrid(false)}
              style={{
                height: 20,
                aspectRatio: 1,
                backgroundColor: !grid
                  ? Apptheme.color.background
                  : 'transparent',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
              }}>
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
            <View
              style={{
                height: 36,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setOpenFrom(true)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgb(80,130,220)',
                  borderRadius: 6,
                  height: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}>
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
                style={{
                  flex: 1,
                  backgroundColor: 'rgb(80,130,220)',
                  borderRadius: 6,
                  height: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}>
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

            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select Time Range"
              style={{
                backgroundColor: 'rgb(80,130,220)',
                borderColor: 'transparent',
                borderRadius: 6,
                height: 32,
                paddingHorizontal: 10,
              }}
              textStyle={{
                fontSize: 14,
                color: Apptheme.color.background,
              }}
              dropDownContainerStyle={{
                backgroundColor: 'rgb(255,255,255)',
                borderColor: 'transparent',
              }}
              listItemLabelStyle={{
                color: Apptheme.color.black,
              }}
              selectedItemLabelStyle={{
                fontWeight: 'bold',
                color: Apptheme.color.black,
              }}
              ArrowDownIconComponent={({style}) => (
                <VectorIcon
                  material-icon
                  name="keyboard-arrow-down"
                  color="#ffffff"
                  size={18}
                />
              )}
              ArrowUpIconComponent={({style}) => (
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

            <Gap m8 />

            <SearchInput placeholder="Category" />
            <Gap m3 />
            <SearchInput placeholder="Author" />
            <Gap m3 />
            <SearchInput placeholder="Search by Credit" />
            <Gap m3 />
            <SearchInput placeholder="Search" />
            <Gap m3 />
            <SearchInput placeholder="Searched Tags" />
            <Gap m3 />
            <SearchInput placeholder="Created By" />
            <Gap m3 />

            <TouchableOpacity style={styles.applyButton}>
              <Text
                style={[
                  FontStyle.labelMedium,
                  {color: Apptheme.color.primary},
                ]}>
                Apply
              </Text>
            </TouchableOpacity>

            {/* Clear Filter Button */}
            <TouchableOpacity style={styles.clearButton}>
              <Text
                style={[
                  FontStyle.labelMedium,
                  {color: Apptheme.color.background},
                ]}>
                Clear Filter
              </Text>
            </TouchableOpacity>
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

            {/* To Date Picker Modal */}
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
      tabBarItemStyle={{width: 100}} // Fixed width (adjust as needed)
      tabBarLabelStyle={{
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        includeFontPadding: false,
        margin: 0,
        padding: 0,
        width: '100%', // Take full width
        textAlign: 'center',
      }}>
      <Tabs.Tab name="Draft-Story">
        <Tabs.ScrollView>
          <DraftStory grid={grid} />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="SCHEDULED">
        <Scheduled grid={grid} FilterOption={FilterOption} />
      </Tabs.Tab>
      <Tabs.Tab name="Published">
        <Tabs.ScrollView>
          <Published grid={grid} />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="Private">
        <Tabs.ScrollView>
          <Published grid={grid} />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default ViewStory;

const styles = StyleSheet.create({
  header: {
    // height: ,
    width: '100%',
    backgroundColor: Apptheme.color.primary,
    padding: Apptheme.spacing.marginHorizontal,
    // justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(80,130,220)',
    borderRadius: 6,
    height: 36,
    paddingHorizontal: 10,
    alignContent: 'center',
  },
  searchIcon: {
    marginRight: 3,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    marginLeft: 6,
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
});
