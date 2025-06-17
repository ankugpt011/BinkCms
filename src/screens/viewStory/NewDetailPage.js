import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
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
import YoutubePlayer from 'react-native-youtube-iframe';
import {formatToIST} from '../../components/atoms/formatToIST';

const NewDetailPage = () => {
  const navigation = useNavigation();
  const userData = useSelector(state => state.login.userData);
  const {apiKey, apiEndPoint, partnerData} = useSelector(state => state.login);
  
  const categoriesData = useSelector(
    state => state.metaData.categories.categories,
  );
  console.log('userData234', categoriesData);
  const sessionId = userData?.sessionId;
  const [data, setData] = useState();
  const {width} = useWindowDimensions();
  const route = useRoute();
  const [webViewVisible, setWebViewVisible] = useState(false);
  console.log('routeghjhgcbj', route.params);

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

  // const editUrl = `https://stagingdc.hocalwire.in//news/add-news/edit_news_applite.jsp?newsId=${route?.params?.id}&page=1&sessionId=${sessionId}`;
  const editUrl = `${partnerData?.cmsUrl}//news/add-news/edit_news_applite.jsp?newsId=${route?.params?.id}&page=1&sessionId=${sessionId}`;

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
        FetchStoryApi(
          0,
          10,
          sessionId,
          route.params?.id,
          route?.params.type == 'Private' ? 'PRIVATE' :route?.params.type == 'SCHEDULED'?'SCHEDULED': null,
        ),
      );
      setData(res?.news[0]);
    }
    console.log('resqwertyuio', res);
  }, [callApi, route.params?.id]);

  console.log('data?.category', data?.otherCategoryIds);

  useEffect(() => {
    if (route.params?.id) {
      fetchData();
    } else {
      setData(route?.params?.data);
    }
  }, [userData, route.params?.id]);

  const RenderImage = ({item}) => {
    console.log('item', item);

    // Handle the case where item might be an object with an 'item' property
    const mediaItem = item.item || item;

    // If it's a YouTube video
    if (mediaItem?.startsWith?.('yt_')) {
      const youtubeId = extractYoutubeId(mediaItem);
      return (
        <View style={{width: 200, height: 120, marginRight: 10}}>
          <YoutubePlayer
            height={120}
            width={200}
            videoId={youtubeId}
            play={false}
          />
        </View>
      );
    }

    // Find matching file in data.files array
    const matchingFile = data?.files?.find(file => file.mediaId == mediaItem);

    // Get the URL - prioritize matchingFile.url, then fall back to mediaItem if it's a string
    const imageUrl =
      matchingFile?.url || (typeof mediaItem === 'string' ? mediaItem : null);

    if (!imageUrl) return null;

    return (
      <Image
        style={{
          height: 110,
          width: 120,
          borderRadius: 4,
          backgroundColor: 'white',
          marginBottom: 5,
        }}
        source={{
          uri: imageUrl,
        }}
        resizeMode="cover"
      />
    );
  };

  const RenderNewsImage = ({item}) => {
    console.log('itemRenderNewsImage', item);

    if (item?.item?.url.startsWith?.('yt_')) {
      const youtubeId = extractYoutubeId(item?.item?.url);
      return (
        <View style={{width: 200, height: 120, marginRight: 10}}>
          <YoutubePlayer
            height={120}
            width={200}
            videoId={youtubeId}
            play={false}
          />
        </View>
      );
    }

    return (
      <Image
        style={{
          height: 110,
          width: 120,
          borderRadius: 4,
          backgroundColor: 'white',
          marginBottom: 5,
        }}
        source={{
          uri: item?.item?.url,
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

  const getCategoryName = categoryId => {
    if (!categoryId || !categoriesData) return null;

    console.log('getCategoryName', categoryId, categoriesData);

    const foundCategory = categoriesData.find(
      category => category.catId == categoryId,
    );

    console.log('foundCategory', foundCategory);

    return foundCategory ? foundCategory.name : null;
  };

  const handleWebViewNavigation = navState => {
    // Check if the current URL no longer contains the newsId parameter
    console.log('navState.url', navState.url);
    const urlHasNewsId = navState.url.includes(`newsId=${route?.params?.id}`);

    if (!urlHasNewsId) {
      closeWebView();
      fetchData(); // Refresh the news data
       ToastAndroid.show(
              'Your news has been updated successfully.',
              ToastAndroid.SHORT,
            );
    }
  };

  console.log('fgvhbjnkmjhgvfdata',data)

  // const ids = (data?.uid || data?.newsId) ? categoryIds.split(',').map(id => parseInt(id.trim(), 10)) : categoryIds;
  const getOtherCategoryNames = categoryIds => {

    console.log('categoryIds123456543',categoryIds)
    if (!categoryIds || !categoriesData) return 'No categories found';


    const ids = Array.isArray(categoryIds)
    ? categoryIds.map(id => parseInt(id, 10))
    : categoryIds.split(',').map(id => parseInt(id.trim(), 10));


    console.log('idsidsidsidssdfbgnbfvdc',ids)

    const names = ids
      .map(id => {
        const category = categoriesData.find(cat => cat.catId == id);
        return category ? category.name : null;
      })
      .filter(Boolean);

    return names.length > 0 ? names.join(', ') : 'No categories found';
  };

  const extractYoutubeId = mediaId => {
    if (mediaId.startsWith('yt_')) {
      return mediaId.replace('yt_', '');
    }
    return mediaId;
  };

  console.log('datafghjklmnbvbnm', data,data?.categories);

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

        {!route?.params?.id ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouteName.BOTTOM_TAB, {
                screen: RouteName.CREATE_STORY,
                params: {
                  data: data,
                },
              });
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
        ) : route?.params?.type === 'Draft' ? (
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
          <Text style={FontStyle.labelLarge}>
            {formatToIST(data?.date_updated ||data?.date_news ||  data?.date_created)}
          </Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Author
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.authorName}</Text>
          <Gap m3 />
          {/* <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Credit
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>{data?.authorName}</Text>
          <Gap m3 /> */}
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Main Category
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>
            {getCategoryName(data?.category||data?.maincategory) ||
              'No category found'}
          </Text>
          <Gap m3 />
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Other Categories
          </Text>
          <Gap m1 />
          <Text style={FontStyle.labelLarge}>
            {/* {getOtherCategoryNames(data?.categories)||getOtherCategoryNames(data?.otherCategoryIds)
              } */}
              {getOtherCategoryNames(data?.categories||data?.otherCategoryIds)}
          </Text>
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
          {route?.params?.type === 'Draft' || !route?.params?.id ? null :
          <>
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
          </>}
          <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
            Cover Images
          </Text>
          <Gap m1 />
          {route?.params?.type === 'Draft' ? (
            <View style={{flexDirection: 'row', gap: 10}}>
              <FlatList
                data={data?.mediaIds?.split(',')}
                horizontal
                renderItem={(item, index) => (
                  <RenderImage item={item} index={index} />
                )}
              />
            </View>
          ) : (
            <FlatList
              data={data?.media}
              horizontal
              renderItem={(item, index) => (
                <RenderNewsImage item={item} index={index} />
              )}
            />
          )}
          {route?.params?.type === 'Draft' ? (
            <>
              <Gap m3 />

              <Text style={[FontStyle.label, {color: Apptheme.color.subText}]}>
                Featured Image
              </Text>
              <Gap m1 />

              <View style={{flexDirection: 'row', gap: 10}}>
                <FlatList
                  data={data?.extraMediaId?.split(',')}
                  horizontal
                  renderItem={(item, index) => (
                    <RenderImage item={item} index={index} />
                  )}
                />
              </View>
            </>
          ) : null}

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
            contentWidth={width*.8}
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
              {formatToIST(
                data?.date_news || data?.date_created || data?.date_updated,
              )}
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
              {data?.createdby_name}
            </Text>
          </View>
        </View>

        <Gap m4 />
        {/* {route?.params?.type === 'Draft' || !route?.params?.id ? null : (
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
        )} */}
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
