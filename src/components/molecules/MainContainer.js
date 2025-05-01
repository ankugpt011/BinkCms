import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../atoms/Gap';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {format} from 'date-fns';
import Modal from 'react-native-modal';
import VectorIcon from '../../assets/vectorIcons';
import TextArea from '../atoms/TextArea';
import CustomDateTimePicker from '../atoms/CustomDateTimePicker';
import Category from '../atoms/Category';
import OtherCategory from '../atoms/OtherCategory';
import MediaSelector from '../atoms/MediaSelector';
import CommonTags from '../atoms/CommonTags';
import StoryCredit from '../atoms/StoryCredit';
import TextEditor from '../atoms/TextEditor';
import useApi from '../../apiServices/UseApi';
import {CategoryList, LocationList} from '../../apiServices/apiHelper';
import {useSelector} from 'react-redux';
import PublicUser from '../atoms/PublicUser';
import Location from '../atoms/Location';

const TAGS = [
  'international relations',
  'tariffs',
  'trade',
  'US',
  'Indonesia',
  'announcement',
  'performance',
];

const users = [
  {id: 1, name: 'Ankush Gupta', email: 'ankugpt011@example.com'},
  {id: 2, name: 'Suresh Kumar', email: 'suresh@example.com'},
  {id: 3, name: 'Manoj Rawat', email: 'manoj@gmail.com'},
  {id: 4, name: 'Vishakha Yadav', email: 'vishakha@example.com'},
];

const RenderItem = ({item, index,formValues, updateFormValue }) => {
  // const [formValues, setFormValues] = useState({});

  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const categoriesData = useSelector(state => state.metaData.categories);
  const locationsData = useSelector(state => state.metaData.locations);
  const tagsData = useSelector(state => state.metaData.tags);
  const configData = useSelector(state => state.metaData.config);

  const types = configData?.story_credits_internal?.value.split(',');

  console.log('tagsData1234', tagsData);
  console.log('locations234', locationsData);
  console.log('categoriesData', categoriesData);


  const HandleInputChange = (fieldId, value) => {
    console.log('valueq2we',value)
    updateFormValue(fieldId, value);
  };

  const HandleInputDateChange = (fieldId, value) => {
    // Ensure value is a Date object
    const dateValue = value instanceof Date ? value : new Date(value);
    
    // For debugging/logging only
    console.log('Selected date (ISO):', dateValue.toISOString());
    console.log('Selected date (local):', dateValue.toString());
    console.log('Formatted date:', format(dateValue, 'yyyy/MM/dd HH:mm:ss'));
    console.log('Formatted date:12345678', dateValue);
    
    // Store the actual Date object in state, not the formatted string
    updateFormValue(fieldId, dateValue.toISOString());
  };

  const handleMediaSelect = media => {
    if (media.type === 'image') {
      console.log('Selected image URI:', media.uri);
    } else if (media.type === 'youtube') {
      console.log('YouTube URL:', media.url);
    }
  };

  const handleSelectTag = tag => {
    console.log('Selected Tag:', tag);
  };

  const handleChange = data => {
    console.log('Credits Updated:', data);
    
    // Loop through all keys in the data object
    Object.entries(data).forEach(([fieldId, value]) => {
      // Call updateFormValue for each key-value pair
      updateFormValue(fieldId, value);
    });
  };

  return (
    <View style={{overflow: 'visible', zIndex: 1}}>
      <Text style={FontStyle.titleSmall}>{item?.element_display_name}</Text>
      <Gap m1 />

      {item?.input_type === 'TEXT_AREA' && (
        <TextArea
          value={formValues[item?.element]}
          onChangeText={text => HandleInputChange(item.element, text)}
          placeholder=""
        />
      )}
      {item?.input_type === 'DATETIME' && (
        <CustomDateTimePicker
        value={formValues[item?.element]}
        onChange={(newDate) => {
          console.log('Raw date object:', newDate);
          console.log('Formatted date:', format(newDate, 'yyyy/MM/dd HH:mm:ss'));
          HandleInputDateChange(item.element, newDate);
        }}
      />
      )}
      {item?.input_type === 'CATEGORY' && (
        <Category
          value={formValues[item?.element]}
          onChange={val => HandleInputChange(item?.element, val)}
          categories={categoriesData?.categories}
        />
      )}

      {item?.input_type === 'OTHER_CATEGORIES' && (
        <OtherCategory
        value={formValues[item.element] || []} // Array of catIds
        onChange={(selectedIds) => HandleInputChange(item.element, selectedIds)}
        data={categoriesData?.categories}
        placeholder="-Select Category-"
      />
      )}

      {item?.input_type === 'LOCATION_SELECT' && (
        <Location
          value={formValues[item.element]}
          onChange={val => HandleInputChange(item.element, val)}
          categories={locationsData?.locations}
          placeholder="-Select Location-"
        />
      )}
      {item?.input_type === 'PUBLIC_USER' && (
        <PublicUser
          value={selectedAuthor}
          onSelect={author =>{ setSelectedAuthor(author);HandleInputChange(item.element, author?.name) }}
        />
      )}

      {item?.input_type === 'MEDIA' && (
        <MediaSelector onMediaSelect={handleMediaSelect} />
      )}

      {item?.input_type === 'COMMON_TAGS' && (
        <CommonTags
          data={tagsData?.tags} // Your full array of tag objects with `id` and `name`
          onSelect={selectedTags => {
            // Convert array of tag objects to comma-separated string of names
            const tagNamesString = selectedTags.map(tag => tag.name).join(', ');
            HandleInputChange(item.element, tagNamesString);
          }}
          placeholder="Search tags..."
        />
      )}

      {item?.input_type === 'STORY_CREDIT' && (
        <StoryCredit users={users} types={types} onChange={handleChange} />
      )}
      {item?.input_type === 'TEXT_EDITOR' && (
        <TextEditor onChange={text => HandleInputChange(item.element, text)} />
      )}

      <Gap m6 />
    </View>
  );
};

const StoryInputSection = ({item, index,formValues, updateFormValue }) => {
  console.log('itemfcgvhbjnkmjbhvgch', item);
  return (
    <View
      style={{
        paddingVertical: Apptheme.spacing.m6,
        backgroundColor: Apptheme.color.background,
        paddingHorizontal: Apptheme.spacing.m3,
        borderRadius: Apptheme.spacing.m2,
        borderWidth: 0.5,
        borderColor: Apptheme.color.boxOutline,
        zIndex: 1,
        overflow: 'visible',
      }}>
      <Text style={[FontStyle.headingSmall, {fontSize: 14}]}>
        {item?.element_display_name}
      </Text>
      <Gap m6 />

      <FlatList
        data={item?.children}
        renderItem={({item, index}) => <RenderItem item={item} index={index} formValues={formValues}
        updateFormValue={updateFormValue} />}
      />
    </View>
  );
};

const MainContainer = ({sections, heading, formValues, updateFormValue}) => {
  console.log('sections12345678', formValues,updateFormValue);
  return (
    <View
      style={{
        backgroundColor: 'rgb(255, 255, 255)',
        marginTop: Apptheme.spacing.m8,
        padding: Apptheme.spacing.m6,
        borderRadius: Apptheme.spacing.m2,
        // marginHorizontal: Apptheme.spacing.marginHorizontal,
      }}>
      <Text style={FontStyle.heading}>{heading}</Text>
      <Gap m4 />

      <FlatList
        data={sections}
        renderItem={({item, index}) => (
          <StoryInputSection
            item={item}
            index={index}
            formValues={formValues}
            updateFormValue={updateFormValue}
          />
        )}
        ItemSeparatorComponent={<Gap m4 />}
      />
    </View>
  );
};

export default MainContainer;
