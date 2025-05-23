import { FlatList, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Apptheme from '../../../assets/theme/Apptheme';
import Gap from '../../../components/atoms/Gap';
import NewsCard from '../../../components/molecules/NewsCard';
import useApi from '../../../apiServices/UseApi';
import { FetchStoryApi } from '../../../apiServices/apiHelper';
import { useSelector } from 'react-redux';
import { Tabs } from 'react-native-collapsible-tab-view';
import NewsCardShimmer from '../../../components/atoms/NewsCardShimmer';
import { formatDateTime } from '../../../components/utils';
import FontStyle from '../../../assets/theme/FontStyle';

const PAGE_SIZE = 10;

const Published = ({ grid = false ,FilterOption,fromDate,toDate,category,searched = "",tag='',author,refresh}) => {
  const userData = useSelector(state => state.login.userData);
  const [storyData, setStoryData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  console.log('filterOption',FilterOption)
  const formattedFromDate = fromDate ? formatDateTime(fromDate) : '';
    const formattedToDate = toDate ? formatDateTime(toDate) : '';
    const { refreshCount } = useSelector(state => state.storyUpdate);

  const { loading, callApi } = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });

  const fetchData = useCallback(async (start = 0) => {
    if (!userData?.sessionId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const res = await callApi(null, FetchStoryApi(start, PAGE_SIZE, userData.sessionId,undefined,'APPROVED',formattedFromDate,formattedToDate,category,searched,author,tag));
    console.log('rescfvbhnjmk',res)
    if (res?.news?.length > 0) {
      setStoryData(prev => [...prev, ...res.news]);
      setStartIndex(start + PAGE_SIZE);
      console.log('publishedcsjncdjbhvcjns',res)
    } else {
      setHasMore(false); // No more data to load
    }
    setLoadingMore(false);
  }, [userData, callApi, loadingMore, hasMore,fromDate,toDate,category,searched,author,tag]);

  useEffect(() => {
    console.log('useEffect2345')
    if (userData?.sessionId) {
      setStoryData([]);
      setStartIndex(0);
      setHasMore(true);
      fetchData(0);
    }
  }, [userData,fromDate,toDate,category,searched,author,tag,refreshCount,refresh]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      console.log('12345handleLoadMore')
      fetchData(startIndex);
    }
  };

  console.log('startIndex',startIndex)

  const RenderView = ({ item, index }) => (
    <NewsCard
      id={item?.newsId}
      image={item?.media?.[0]?.url}
      date={item?.date_news}
      author={item?.authorName}
      title={item?.heading}
      grid={grid}
      type={"Published"}
    />
  );

  return (
   
      <Tabs.FlatList
        key={grid ? 'grid' : 'list'}
        data={storyData}
        renderItem={({ item, index }) => <RenderView item={item} index={index} />}
        keyExtractor={(item, index) => item?.newsId?.toString() || index.toString()}
        numColumns={grid ? 2 : 1}
        ListEmptyComponent={<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text style={FontStyle.labelLarge}>No Published News</Text>
        </View>}
        columnWrapperStyle={grid ? styles.rowWrapper : null}
        contentContainerStyle={{paddingBottom:40,paddingTop:FilterOption ? 480: 100,paddingHorizontal:10}}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ flexDirection: grid ? 'row' : 'column', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {[...Array(grid ? 2 : 1)].map((_, index) => (
                <NewsCardShimmer key={index} grid={grid} />
              ))}
            </View>
          ) : null
        }
      />
      
    
  );
};

export default Published;

const styles = StyleSheet.create({
  rowWrapper: {
    justifyContent: 'space-between',
  },
});
