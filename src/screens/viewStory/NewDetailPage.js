import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import VectorIcon from '../../assets/vectorIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Gap from '../../components/atoms/Gap';
import useApi from '../../apiServices/UseApi';
import {DraftStoryApi, FetchStoryApi} from '../../apiServices/apiHelper';
import {useSelector} from 'react-redux';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import RouteName from '../../navigation/RouteName';
import WebView from 'react-native-webview';

const NewDetailPage = () => {
  const navigation = useNavigation();
  const userData = useSelector(state => state.login.userData);
  console.log('userData234',userData)
  const sessionId = userData?.sessionId;
  const [data, setData] = useState();
  const {width} = useWindowDimensions();
  const route = useRoute();
  const [webViewVisible, setWebViewVisible] = useState(false);

  const handleEditPress = () => {
    console.log('fghjnkjhgfchvbjn');
    setWebViewVisible(true);
  };

  const closeWebView = () => {
    setWebViewVisible(false);
  };
  console.log('route?.params?.id', route?.params?.type);

  console.log('route2134', route.params);
  const {loading, callApi} = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });

  const editUrl = `https://stagingdc.hocalwire.in//news/add-news/edit_news_applite.jsp?newsId=${route?.params?.id}&page=1&sessionId=${sessionId}`;

  const fetchData = useCallback(async () => {
    let res;
    const sessionId = userData?.sessionId;
    if (route?.params?.type === 'Draft') {
      res = await callApi(
        null,
        DraftStoryApi(0, 10, sessionId, 'story-by-id', route.params?.id),
      );
      setData(res);
    } else {
      res = await callApi(
        null,
        FetchStoryApi(0, 10, sessionId, route.params?.id),
      );
      setData(res?.news[0]);
    }
    console.log('resqwertyuio', res);
  }, [callApi, route.params?.id]);

  useEffect(() => {
    fetchData();
  }, [userData, route.params?.id]);

  const RenderImage = ({item}) => {
    console.log('item23456789', item.item.url);
    return (
      <Image
        style={{
          height: 80,
          width: 160,
          borderRadius: 4,
          backgroundColor: 'white',
        }}
        source={{
          uri: item.item.url,
        }}
        resizeMode="cover"
      />
    );
  };

  const tagsStyles = {
    div: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
    },
    p: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
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

  const handleWebViewNavigation = (navState) => {
    // Check if the current URL no longer contains the newsId parameter
    console.log('navState.url',navState.url)
    const urlHasNewsId = navState.url.includes(`newsId=${route?.params?.id}`);
    
    if (!urlHasNewsId) {
      closeWebView();
      fetchData(); // Refresh the news data
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          padding: Apptheme.spacing.marginHorizontal,
          backgroundColor: Apptheme.color.primary,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <VectorIcon
            material-icon
            name="arrow-back-ios"
            color={Apptheme.color.background}
            size={18}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
        <Text
          style={[
            FontStyle.headingLarge,
            {color: Apptheme.color.background, flex: 1},
          ]}>
          News Details
        </Text>

        {route?.params?.type === 'Draft' ? (
          userData?.can_edit_story ? (
            <TouchableOpacity
              onPress={() => {
                route?.params?.type == 'Draft'
                  ? navigation.navigate(RouteName.BOTTOM_TAB, {
                      screen: RouteName.CREATE_STORY,
                      params: {
                        data: data,
                      },
                    })
                  : handleEditPress();
              }}
              style={{
                paddingHorizontal: 6,
                paddingVertical: 6,
                backgroundColor: Apptheme.color.background,
                borderRadius: 4,
                flexDirection: 'row',
              }}>
              <VectorIcon material-icon name="edit" size={14} />
              <Gap row m2 />
              <Text style={FontStyle.titleSmall}>Edit News</Text>
            </TouchableOpacity>
          ) : null
        ) : userData?.can_edit_news ? (
          <TouchableOpacity
            onPress={() => {
              route?.params?.type == 'Draft'
                ? navigation.navigate(RouteName.BOTTOM_TAB, {
                    screen: RouteName.CREATE_STORY,
                    params: {
                      data: data,
                    },
                  })
                : handleEditPress();
            }}
            style={{
              paddingHorizontal: 6,
              paddingVertical: 6,
              backgroundColor: Apptheme.color.background,
              borderRadius: 4,
              flexDirection: 'row',
            }}>
            <VectorIcon material-icon name="edit" size={14} />
            <Gap row m2 />
            <Text style={FontStyle.titleSmall}>Edit News</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <ScrollView style={{padding: Apptheme.spacing.marginHorizontal, flex: 1}}>
        <Gap m4 />
        <View
          style={{
            padding: Apptheme.spacing.marginHorizontal,
            elevation: 2,
            backgroundColor: Apptheme.color.background,
            borderRadius: 6,
          }}>
          <Text
            style={[
              FontStyle.headingSmall,
              {
                color: Apptheme.color.primary,
                borderBottomWidth: 1,
                borderColor: Apptheme.color.primary,
                paddingBottom: 8,
                flex: 1,
              },
            ]}>
            Detail
          </Text>
          <Gap m8 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Heading
          </Text>
          <Gap m1 />

          <Text style={FontStyle.labelLarge}>{data?.heading}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Description
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.description}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            News Time
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.date_news}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Author
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.authorName}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Credit
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.authorName}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Main Category
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.maincategory_name}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Other Categories
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>चित्रशाला</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Location
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.location}</Text>
        </View>
        <Gap m4 />
        <View
          style={{
            padding: Apptheme.spacing.marginHorizontal,
            elevation: 2,
            backgroundColor: Apptheme.color.background,
            borderRadius: 6,
          }}>
          <Text
            style={[
              FontStyle.headingSmall,
              {
                color: Apptheme.color.primary,
                borderBottomWidth: 1,
                borderColor: Apptheme.color.primary,
                paddingBottom: 8,
                flex: 1,
              },
            ]}>
            Other Details
          </Text>
          <Gap m8 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Tags
          </Text>
          <Gap m1 />

          <Text style={FontStyle.labelLarge}>{data?.tags}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Keywords
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.keywords}</Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            News URL
          </Text>
          <Gap m1 />
          <Text
            style={[
              FontStyle.labelLarge,
              {color: Apptheme.color.primary, textDecorationLine: 'underline'},
            ]}>
            {data?.url}
          </Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Images
          </Text>
          <Gap m1 />
          {route?.params?.type === 'Draft' ? (
            <Image
              style={{
                height: 80,
                width: 160,
                borderRadius: 4,
                backgroundColor: 'white',
              }}
              source={{
                uri: data?.mediaIds,
              }}
              resizeMode="cover"
            />
          ) : (
            <FlatList
              data={data?.media}
              renderItem={(item, index) => (
                <RenderImage item={item} index={index} />
              )}
            />
          )}

          <Gap m3 />
        </View>
        <Gap m4 />

        <View
          style={{
            padding: Apptheme.spacing.marginHorizontal,
            elevation: 2,
            backgroundColor: Apptheme.color.background,
            borderRadius: 6,
          }}>
          <Text
            style={[
              FontStyle.headingSmall,
              {
                color: Apptheme.color.primary,
                borderBottomWidth: 1,
                borderColor: Apptheme.color.primary,
                paddingBottom: 8,
                flex: 1,
              },
            ]}>
            Detailed Story
          </Text>
          <Gap m8 />
          <RenderHtml
            contentWidth={width}
            source={{html: data?.story}}
            tagsStyles={tagsStyles}
          />
          {/* <Text style={FontStyle.labelLarge}>
          {data?.story}
          </Text> */}
        </View>
        <Gap m4 />
        <View
          style={{
            padding: Apptheme.spacing.marginHorizontal,
            elevation: 2,
            backgroundColor: Apptheme.color.background,
            borderRadius: 6,
          }}>
          <Text
            style={[
              FontStyle.headingSmall,
              {
                color: Apptheme.color.primary,
                borderBottomWidth: 1,
                borderColor: Apptheme.color.primary,
                paddingBottom: 8,
              },
            ]}>
            Story Details: (Before Publish)
          </Text>
          <Gap m8 />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={[
                FontStyle.labelLarge,
                {flex: 1, color: Apptheme.color.subText},
              ]}>
              ID
            </Text>
            <Text style={[FontStyle.labelLarge, {flex: 3}]}>
              {data?.newsId || data?.uid}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={[
                FontStyle.labelLarge,
                {flex: 1, color: Apptheme.color.subText},
              ]}>
              Heading
            </Text>
            <Text style={[FontStyle.labelLarge, {flex: 3}]}>
              {data?.heading}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={[
                FontStyle.labelLarge,
                {flex: 1, color: Apptheme.color.subText},
              ]}>
              Date Created
            </Text>
            <Text style={[FontStyle.labelLarge, {flex: 3}]}>
              {data?.date_news}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={[
                FontStyle.labelLarge,
                {flex: 1, color: Apptheme.color.subText},
              ]}>
              Created By
            </Text>
            <Text style={[FontStyle.labelLarge, {flex: 3}]}>
              {data?.authorName}
            </Text>
          </View>
        </View>

        <Gap m4 />
        <View
          style={{
            padding: Apptheme.spacing.marginHorizontal,
            elevation: 2,
            backgroundColor: Apptheme.color.background,
            borderRadius: 6,
          }}>
          <Text
            style={[
              FontStyle.headingSmall,
              {
                color: Apptheme.color.primary,
                borderBottomWidth: 1,
                borderColor: Apptheme.color.primary,
                paddingBottom: 8,
              },
            ]}>
            News Change Log (After Publishing)
          </Text>
          <Gap m8 />
          <View style={{marginBottom: 8}}>
            <Text style={[FontStyle.labelLarge]}>Changed By</Text>
            <Text style={FontStyle.label}>{data?.authorName}</Text>
            <Text style={FontStyle.label}>at : {data?.date_news}</Text>
          </View>
          <View style={{marginBottom: 8}}>
            <Text style={[FontStyle.labelLarge]}>Items Changed</Text>
            <Text style={FontStyle.label}>Credit Changed</Text>
          </View>
          <View style={{marginBottom: 8}}>
            <Text style={[FontStyle.labelLarge]}>Changed From</Text>
            <Text style={FontStyle.label}>-</Text>
          </View>
          <View style={{marginBottom: 8}}>
            <Text style={[FontStyle.labelLarge]}>Changed To</Text>
            <Text style={FontStyle.label}>By: archana@blinkcms.ai</Text>
          </View>
        </View>
        <Gap m4 />

        <Gap ml />
        <Gap ml />
      </ScrollView>
      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={closeWebView}>
        <View style={styles.webViewContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
            <VectorIcon name="close" size={24} color={Apptheme.color.black} />
          </TouchableOpacity>
          {console.log('editURL', editUrl)}
          <WebView
  source={{uri: editUrl}}
  style={styles.webView}
  onNavigationStateChange={handleWebViewNavigation}
  startInLoadingState={true}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  sharedCookiesEnabled={true}
/>
        </View>
      </Modal>
    </View>
  );
};

export default NewDetailPage;

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    marginTop: 30, // Add some margin for status bar
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    padding: 5,
  },
  webView: {
    flex: 1,
  },
});
