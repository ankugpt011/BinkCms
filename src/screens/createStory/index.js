import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import MainContainer from '../../components/molecules/MainContainer';
import useApi from '../../apiServices/UseApi';
import {Create_Story_PageLayout, CreateStoryApi} from '../../apiServices/apiHelper';
import VectorIcon from '../../assets/vectorIcons';

import { useSelector } from 'react-redux';

const CreateStory = () => {
  const scrollViewRef = useRef(null);
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const userData = useSelector(state => state.login.userData);
  const [data, setData] = useState();
  const [headerData, setHeaderData] = useState([]);
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  const [formValues, setFormValues] = useState({
    action: 'create_multipage',
    tempProcessId: generateId(),
    sessionId: userData?.sessionId
  });


  const sectionOffsets = useRef({});
  const {callApi} = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });
  const {callApi: postStoryApi} = useApi({ method: 'POST', url: '', manual: true });

  



  useEffect(() => {
    const fetchData = async () => {
      const res = await callApi(null, Create_Story_PageLayout());
      setData(res);
      if (res) {
        const transformedHeaderData = Object.entries(res).map(([key], index) => ({
          number: index + 1,
          heading: key,
          sectionKey: key,
        }));
        setHeaderData(transformedHeaderData);
      }
    };
    fetchData();
  }, []);


  // 
  
  const updateFormValue = (fieldKey, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      tempProcessId: generateId()
    }));
  }, []);


  const handleSubmit = async () => {
    console.log('Form data:', formValues);
    const body = formValues
    try {
      const response = await postStoryApi(body, CreateStoryApi());
      console.log('POST Response:', response);
    } catch (error) {
      console.error('POST Error:', error);
    }
  };

  const onSectionLayout = (event, sectionKey) => {
    sectionOffsets.current[sectionKey] = event.nativeEvent.layout.y;
  };

  const onScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const offsetEntries = Object.entries(sectionOffsets.current);
    let currentActiveIndex = 0;

    for (let i = 0; i < offsetEntries.length; i++) {
      const [key, offsetY] = offsetEntries[i];
      const nextOffsetY = offsetEntries[i + 1]?.[1] ?? Infinity;

      if (scrollY >= offsetY - 100 && scrollY < nextOffsetY - 100) {
        currentActiveIndex = i;
        break;
      }
    }

    setActiveIndex(currentActiveIndex);
  };

  const scrollToSection = index => {
    const sectionKey = headerData[index].sectionKey;
    const y = sectionOffsets.current[sectionKey];
    if (y !== undefined) {
      scrollViewRef.current?.scrollTo({y, animated: true});
      setActiveIndex(index);
    }
  };

  const RenderHeader = ({item, index}) => {
    const isActive = index === activeIndex;
    return (
      <TouchableOpacity onPress={() => scrollToSection(index)}>
        <View style={styles.headerItemContainer}>
          <View
            style={[
              styles.headerCircle,
              {
                borderColor: isActive
                  ? Apptheme.color.primary
                  : Apptheme.color.boxOutline,
                backgroundColor: isActive ? Apptheme.color.primary : 'transparent',
              },
            ]}>
            <Text
              style={[
                FontStyle.headingSmall,
                {
                  color: isActive
                    ? Apptheme.color.background
                    : Apptheme.color.primary,
                },
              ]}>
              {item?.number}
            </Text>
          </View>
          <Gap m2 />
          <Text
            style={[
              FontStyle.titleSmall,
              styles.headerLabel,
              {
                color: isActive ? Apptheme.color.primary : Apptheme.color.text,
              },
            ]}>
            {item?.heading}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex: 1}}>
      
    <View style={styles.container}>
      <StatusBar backgroundColor={Apptheme.color.primary} />
      <View style={styles.topBar}>
        <Text style={[FontStyle.headingLarge, styles.topBarTitle]}>
          Create Story
        </Text>
        <Gap m9 />
        <Gap m3 />
      </View>

      <View style={styles.fixedHeader}>
        <FlatList
          ref={flatListRef}
          data={headerData}
          renderItem={({item, index}) => (
            <RenderHeader item={item} index={index} />
          )}
          horizontal
          ItemSeparatorComponent={<Gap row m8 />}
          contentContainerStyle={styles.headerListContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <ScrollView
        style={styles.contentScroll}
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {data
          ? Object.entries(data)?.map(([sectionKey, groupList]) => (
              <View
                key={sectionKey}
                onLayout={event => onSectionLayout(event, sectionKey)}>
                <MainContainer
                  sections={groupList}
                  heading={sectionKey}
                  formValues={formValues}
                    updateFormValue={updateFormValue}
                />
              </View>
            ))
          : null}

        <Gap m8 />

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <VectorIcon
              material-community-icon
              name="content-save"
              style={styles.icon}
              size={16}
            />
            <Text style={FontStyle.labelLarge}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.actionButton}>
            <VectorIcon
              material-community-icon
              name="send"
              style={styles.icon}
              size={16}
            />
            <Text style={FontStyle.labelLarge}>Submit for review</Text>
          </TouchableOpacity>
        </View>

        <Gap m8 />
      </ScrollView>
    </View>
    
    </KeyboardAvoidingView>
  );
};

export default CreateStory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    backgroundColor: Apptheme.color.primary,
    padding: Apptheme.spacing.marginHorizontal,
    paddingBottom: 20,
  },
  topBarTitle: {
    color: Apptheme.color.background,
  },
  fixedHeader: {
    position: 'absolute',
    height: 90,
    width: '95%',
    backgroundColor: '#ffffff',
    elevation: 2,
    top: 55,
    zIndex: 10,
    marginHorizontal: 10,
    borderRadius: 4,
  },
  headerListContent: {
    paddingLeft: 10,
  },
  contentScroll: {
    paddingTop: 30, // So content doesn't get hidden behind header
  },
  headerItemContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  headerCircle: {
    height: 30,
    aspectRatio: 1,
    borderRadius: 360,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel: {
    width: 60,
    alignSelf: 'center',
    textAlign: 'center',
  },
  footerActions: {
    flexDirection: 'row',
    padding: Apptheme.spacing.marginHorizontal,
    backgroundColor: 'white',
    elevation: 10,
    gap: 10,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Apptheme.color.containerBackground,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
});


// import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, Button, Alert } from 'react-native'
// import React, { useRef } from 'react'
// import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

// const CreateStory = () => {
//   const richText = useRef();

//   const handleConfirm = async () => {
//     const contentHtml = await richText.current?.getContentHtml();
//     console.log("Final HTML:", contentHtml);

//     Alert.alert("Content Stored As:", contentHtml.substring(0, 100) + '...'); // just showing part of it
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <RichEditor
//           ref={richText}
//           style={styles.rich}
//           placeholder="Start writing here..."
//           onChange={(text) => {
//             console.log("Rich Text (onChange):", text); // HTML string
//           }}
//         />

//         {/* Confirm Button */}
//         <View style={styles.confirmContainer}>
//           <Button title="Confirm" onPress={handleConfirm} />
//         </View>
//       </ScrollView>

//       <RichToolbar
//         editor={richText}
//         actions={[
//           actions.setBold,
//           actions.setItalic,
//           actions.setUnderline,
//           actions.heading1,
//           actions.heading2,
//           actions.insertBulletsList,
//           actions.insertOrderedList,
//           actions.insertImage,
//           'customInsertVideo',
//           actions.insertLink,
//           actions.setStrikethrough,
//           actions.setSubscript,
//           actions.setSuperscript,
//           actions.removeFormat,
//           actions.undo,
//           actions.redo,
//           actions.checkboxList,
//         ]}
//         iconMap={{
//           customInsertVideo: () => (
//             <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}>vi🎥</Text>
//           ),
//         }}
//         onPress={(action) => {
//           if (action === 'customInsertVideo') {
//             console.log('Video button clicked');
//             const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
//             richText.current?.insertVideo(videoUrl);
//           }
//         }}
//         onPressAddImage={() => {
//           const imageUrl = "https://images.unsplash.com/photo-1742943892627-f7e4ddf91224?w=900&auto=format&fit=crop&q=60";
//           richText.current?.insertImage(imageUrl);
//         }}
//         style={styles.richBar}
//       />
//     </KeyboardAvoidingView>
//   );
// };

// export default CreateStory;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scroll: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   rich: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     minHeight: 300,
//     borderRadius: 10,
//     padding: 10,
//   },
//   richBar: {
//     backgroundColor: '#f5f5f5',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//   },
//   confirmContainer: {
//     marginTop: 20,
//   },
// });
