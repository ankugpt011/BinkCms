// import {
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import useApi from '../../apiServices/UseApi';
// import {buzzList} from '../../apiServices/apiHelper';
// import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
// import Apptheme from '../../assets/theme/Apptheme';
// import FontStyle from '../../assets/theme/FontStyle';
// import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Gap from '../../components/atoms/Gap';
// import RenderHtml from 'react-native-render-html';
// import RouteName from '../../navigation/RouteName';

// const ShowBuzz = () => {
//   const {width} = useWindowDimensions();
//   const navigation = useNavigation();
//   const isFocused = useIsFocused()

//   const tagsStyles = {
//     div: {
//       color: '#333',
//       fontSize: 16,
//       lineHeight: 24,
//       // marginBottom: 12,
//     },
//     p: {
//       color: '#333',
//       fontSize: 16,
//       lineHeight: 24,
//       // marginBottom: 12,
//     },
//     strong: {
//       fontWeight: 'bold',
//       color: '#000',
//     },
//     em: {
//       fontStyle: 'italic',
//       color: '#444',
//     },
//   };

//   const {
//     data: buzzData,
//     loading: buzzLoading,
//     callApi: fetchBuzzNews,
//   } = useApi({method: 'GET', manual: true});

//   const route = useRoute();
//   const newsId = route?.params?.newsId;
//   // const refresh = route?.params?.detail

//   useEffect(() => {
//     if (isFocused && newsId) {
//       const url = buzzList(newsId);
//       fetchBuzzNews(null, url);
//     }
//   }, [newsId,isFocused]);

//   console.log('buzzData', buzzData);

//   const RenderItem = ({item, index}) => {
//     console.log('item1234', item);
//     return (
//       <View
//         style={{
//           height: 100,
//           backgroundColor: 'white',
//           borderRadius: 8,
//           padding: 8,
//         }}>
//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <Text
//             style={[FontStyle.headingSmall, {color: Apptheme.color.primary}]}>
//             {item?.id}
//           </Text>
//           <View style={{flexDirection: 'row'}}>
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.navigate(RouteName.EDIT_BUZZ,{newsId:newsId,buzzDetail:item});
//               }}>
//               <VectorIcon
//                 name="square-edit-outline"
//                 size={16}
//                 color={Apptheme.color.black}
//               />
//             </TouchableOpacity>
//             <Gap row m5 />
//             <TouchableOpacity>
//               <VectorIcon name="delete" size={16} color={Apptheme.color.red} />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <Gap m2 />
//         <Text style={FontStyle.headingSmall}>{item?.heading} (published)</Text>
//         <Gap m1 />
//         <RenderHtml
//           contentWidth={width}
//           source={{html: item?.story}}
//           tagsStyles={tagsStyles}
//         />
//         <Gap m1 />
//         <Text style={[FontStyle.titleSmall, {color: 'rgba(0,0,0,0.5)'}]}>
//           May 20, 2025 1:08 PM
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View
//       style={{flex: 1, backgroundColor: Apptheme.color.containerBackground}}>
//       <View
//         style={{
//           backgroundColor: Apptheme.color.primary,
//           padding: 20,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}>
//         <Text style={[FontStyle.heading, {color: Apptheme.color.background}]}>
//           ShowBuzz
//         </Text>
//         <TouchableOpacity
//          onPress={() => {
//           navigation.navigate(RouteName.EDIT_BUZZ,{newsId:newsId});
//         }}
//           style={{
//             paddingHorizontal: 10,
//             paddingVertical: 5,
//             backgroundColor: Apptheme.color.background,
//             borderRadius: 4,
//           }}>
//           <Text style={[FontStyle.label]}>Add buzz</Text>
//         </TouchableOpacity>
//       </View>
//       <ScrollView style={{padding: 20, paddingHorizontal: 10}}>
//         <FlatList
//           data={buzzData?.buzz}
//           renderItem={({item, index}) => (
//             <RenderItem item={item} index={index} />
//           )}
//           ItemSeparatorComponent={<Gap m3/>}
//           contentContainerStyle={{paddingBottom:50}}
//         />
//       </ScrollView>
//     </View>
//   );
// };

// export default ShowBuzz;

// const styles = StyleSheet.create({});

import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import useApi from '../../apiServices/UseApi';
import {buzzList} from '../../apiServices/apiHelper';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
// import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Gap from '../../components/atoms/Gap';
import RenderHtml from 'react-native-render-html';
import RouteName from '../../navigation/RouteName';
import {formatToIST} from '../../components/atoms/formatToIST';
import  VectorIcon  from '../../assets/vectorIcons';

const ShowBuzz = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if screen is focused
  const route = useRoute();
  const newsId = route?.params?.newsId;

  const tagsStyles = {
    div: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
    },
    p: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
    },
    strong: {
      fontWeight: 'bold',
      color: '#000',
    },
    em: {
      fontStyle: 'italic',
      color: '#444',
    },
  };

  const {
    data: buzzData,
    loading: buzzLoading,
    error: buzzError,
    callApi: fetchBuzzNews,
  } = useApi({method: 'GET', manual: true});

  // Fetch data when screen focuses or newsId changes
  useEffect(() => {
    if (isFocused && newsId) {
      const url = buzzList(newsId);
      fetchBuzzNews(null, url);
    }
  }, [isFocused, newsId]);

  const RenderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          elevation: 2,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={[FontStyle.headingSmall, {color: Apptheme.color.primary}]}>
            {item?.id}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RouteName.EDIT_BUZZ, {
                  newsId: newsId,
                  buzzDetail: item,
                });
              }}>
              <VectorIcon
              material-community-icon
                name="square-edit-outline"
                size={20}
                color={Apptheme.color.black}
              />
            </TouchableOpacity>
            <Gap row m5 />
            <TouchableOpacity>
              <VectorIcon material-community-icon name="delete" size={20} color={Apptheme.color.red} />
            </TouchableOpacity>
          </View>
        </View>
        <Gap m2 />
        <Text style={FontStyle.headingSmall}>
          {item?.heading}
          {/* <Text style={{color: Apptheme.color.green}}>
            {item?.state === 'PUBLISHED' ? ' (published)' : ' (draft)'}
          </Text> */}
        </Text>
        <Gap m1 />
        <RenderHtml
          contentWidth={width}
          source={{html: item?.story}}
          tagsStyles={tagsStyles}
        />
        <Gap m1 />
        <Text style={[FontStyle.titleSmall, {color: 'rgba(0,0,0,0.5)'}]}>
          {formatToIST(item?.date_created)}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{flex: 1, backgroundColor: Apptheme.color.containerBackground}}>
      <View
        style={{
          backgroundColor: Apptheme.color.primary,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <VectorIcon
              material-icon
              name="arrow-back-ios"
              color={Apptheme.color.background}
              size={18}
              style={{marginRight: 10}}
            />
          </TouchableOpacity>
          <Text style={[FontStyle.heading, {color: Apptheme.color.background}]}>
            ShowBuzz
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteName.EDIT_BUZZ, {newsId: newsId});
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: Apptheme.color.background,
            borderRadius: 4,
          }}>
          <Text style={[FontStyle.label, {color: Apptheme.color.primary}]}>
            Add buzz
          </Text>
        </TouchableOpacity>
      </View>

      {buzzLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading...</Text>
        </View>
      ) : buzzError ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: Apptheme.color.red}}>
            Error loading buzzes. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => {
              const url = buzzList(newsId);
              fetchBuzzNews(null, url);
            }}
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: Apptheme.color.primary,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={buzzData?.buzz || []}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
          ItemSeparatorComponent={<Gap m3 />}
          contentContainerStyle={{padding: 16}}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}>
              <Gap m6 />
              <Gap m6 />
              <Gap m6 />
              <Text style={FontStyle.labelMedium}>No buzzes found</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(RouteName.EDIT_BUZZ, {newsId: newsId});
                }}
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: Apptheme.color.primary,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white'}}>Create your first buzz</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ShowBuzz;

const styles = StyleSheet.create({});
