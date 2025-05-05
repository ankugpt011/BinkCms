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

const RenderItem = ({
  item,
  index,
  formValues,
  updateFormValue,
  invalidFields,
}) => {
  const isInvalid = invalidFields.includes(item.element);
  const fieldValue = formValues[item?.element];
  console.log('formValues12345678', formValues);

  console.log('fieldValue', fieldValue);

  // Redux selectors
  const categoriesData = useSelector(state => state.metaData.categories);
  const locationsData = useSelector(state => state.metaData.locations);
  const tagsData = useSelector(state => state.metaData.tags);
  const configData = useSelector(state => state.metaData.config);
  const types = configData?.story_credits_internal?.value.split(',');

  // State for components that need internal state
  const [selectedAuthor, setSelectedAuthor] = useState(
    item?.input_type === 'PUBLIC_USER' && fieldValue
      ? {name: fieldValue}
      : null,
  );

  // Handle different input types
  const handleValueChange = value => {
    console.log(`Updating ${item.element}:`, value);
    updateFormValue(item.element, value);
  };

  // Special handler for media fields
  // const handleMediaSelect = media => {
  //   console.log('234565432missingFields', media);
  //   const mediaValue = media?.mediaId || media?.uri || media?.url;
  //   handleValueChange(mediaValue);
  // };

  const handleMediaSelect = media => {
    console.log('Media selected for field:', item.element, 'Data:', media);
    if (media) {
      // For image uploads
      if (media.type === 'image') {
        handleValueChange(media.mediaId); // or media.uri depending on your needs
      } 
      // For YouTube URLs
      else if (media.type === 'youtube') {
        handleValueChange(media.mediaId);
      }
    } else {
      // When media is removed
      handleValueChange(null);
    }
  };

  // Special handler for tags (array to string conversion)
  const handleTagsSelect = selectedTags => {
    const tagNamesString = selectedTags.map(tag => tag.name).join(', ');
    handleValueChange(tagNamesString);
  };

  // Special handler for date fields
  const handleDateChange = date => {
    const dateValue = date instanceof Date ? date : new Date(date);
    handleValueChange(dateValue.toISOString());
  };

  // Special handler for story credits
  const handleCreditsChange = data => {
    Object.entries(data).forEach(([fieldId, value]) => {
      updateFormValue(fieldId, value);
    });
  };

  // Render the appropriate input component based on type
  const renderInputComponent = () => {
    switch (item?.input_type) {
      case 'TEXT_AREA':
        return (
          <TextArea
            value={fieldValue || ''}
            onChangeText={handleValueChange}
            placeholder=""
            multiline={true}
          />
        );

      case 'CUSTOM_PARAM':
        return (
          <TextArea
            value={fieldValue || ''}
            onChangeText={handleValueChange}
            placeholder=""
            multiline={false}
          />
        );

      case 'DATETIME':
        return (
          <CustomDateTimePicker
            value={fieldValue ? new Date(fieldValue) : new Date()}
            onChange={handleDateChange}
          />
        );

      case 'CATEGORY':
        return (
          <Category
            value={fieldValue}
            onChange={handleValueChange}
            categories={categoriesData?.categories || []}
          />
        );

      case 'OTHER_CATEGORIES':
        console.log('fieldValueOTHER_CATEGORIES', fieldValue);
        return (
          <OtherCategory
            // value={Array.isArray(fieldValue) ? fieldValue : []}
            value={
              Array.isArray(fieldValue)
                ? fieldValue
                : typeof fieldValue === 'string' && fieldValue.includes(',')
                ? fieldValue.split(',').map(id => id.trim())
                : fieldValue
                ? [String(fieldValue)]
                : []
            }
            onChange={handleValueChange}
            data={categoriesData?.categories || []}
            placeholder="-Select Category-"
          />
        );

      case 'LOCATION_SELECT':
        console.log('fieldValueLOCATION_SELECT', fieldValue);
        return (
          <Location
            value={fieldValue}
            onChange={handleValueChange}
            categories={locationsData?.locations || []}
            placeholder="-Select Location-"
          />
        );

      case 'PUBLIC_USER':
        return (
          <PublicUser
            value={selectedAuthor}
            onSelect={author => {
              setSelectedAuthor(author);
              handleValueChange(author?.name);
            }}
          />
        );

      case 'MEDIA':
        console.log('fieldValueOTHER_CATEGORIESMEDIA', fieldValue);

        return (
          <MediaSelector
            onMediaSelect={handleMediaSelect}
            initialMedia={fieldValue}
            fieldElement={item.element} // Pass the dynamic field name
          />
        );

      case 'COMMON_TAGS':
        console.log('COMMON_TAGS', fieldValue);
        return (
          <CommonTags
            data={tagsData?.tags || []}
            onSelect={handleTagsSelect}
            initialTags={
              fieldValue ? fieldValue.split(',').map(t => t.trim()) : []
            }
            placeholder="Search tags..."
          />
        );

      case 'STORY_CREDIT':
        return (
          <StoryCredit
            types={types}
            onChange={handleCreditsChange}
            initialValues={formValues}
          />
        );

      case 'TEXT_EDITOR':
        console.log('TEXT_EDITOR', fieldValue);
        return (
          <TextEditor
            onChange={handleValueChange}
            initialContent={fieldValue}
          />
        );

      // default:
      //   return (
      //     <TextInput
      //       value={fieldValue || ''}
      //       onChangeText={handleValueChange}
      //       style={{
      //         borderWidth: 1,
      //         borderColor: Apptheme.color.boxOutline,
      //         borderRadius: Apptheme.spacing.m1,
      //         padding: Apptheme.spacing.m2,
      //         fontSize: 14,
      //       }}
      //     />
      //   );
    }
  };

  return (
    <View
      style={[
        {
          overflow: 'visible',
          zIndex: 1,
          marginBottom: Apptheme.spacing.m2,
        },
        isInvalid && {
          borderLeftWidth: 2,
          borderLeftColor: Apptheme.color.red,
          paddingLeft: Apptheme.spacing.m2,
        },
      ]}>
      <Text
        style={[
          FontStyle.titleSmall,
          isInvalid && {color: Apptheme.color.red},
        ]}>
        {item?.element_display_name}
        {item?.is_mandatory ? '*' : ''}
      </Text>
      <Gap m1 />
      {renderInputComponent()}
      <Gap m6 />
    </View>
  );
};

const styles = {
  fieldContainer: {
    overflow: 'visible',
    zIndex: 1,
    marginBottom: Apptheme.spacing.m2,
  },
  invalidField: {
    borderLeftWidth: 2,
    borderLeftColor: Apptheme.color.red,
    paddingLeft: Apptheme.spacing.m2,
  },
  defaultInput: {
    borderWidth: 1,
    borderColor: Apptheme.color.boxOutline,
    borderRadius: Apptheme.spacing.m1,
    padding: Apptheme.spacing.m2,
    fontSize: 14,
  },
};

const StoryInputSection = ({
  item,
  index,
  formValues,
  updateFormValue,
  invalidFields,
}) => {
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
        renderItem={({item, index}) => (
          <RenderItem
            item={item}
            index={index}
            formValues={formValues}
            invalidFields={invalidFields}
            updateFormValue={updateFormValue}
          />
        )}
      />
    </View>
  );
};

const MainContainer = ({
  sections,
  heading,
  formValues,
  updateFormValue,
  invalidFields,
}) => {
  console.log('sections12345678', formValues, updateFormValue);
  if (!formValues) {
    return <Text>Loading...</Text>;
  }
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
            invalidFields={invalidFields}
          />
        )}
        ItemSeparatorComponent={<Gap m4 />}
      />
    </View>
  );
};

export default MainContainer;
