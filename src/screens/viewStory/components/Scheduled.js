import { FlatList, ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Apptheme from '../../../assets/theme/Apptheme';
import Gap from '../../../components/atoms/Gap';
import NewsCard from '../../../components/molecules/NewsCard';
import useApi from '../../../apiServices/UseApi';
import { FetchStoryApi } from '../../../apiServices/apiHelper';
import { useSelector } from 'react-redux';
import { Tabs } from 'react-native-collapsible-tab-view';
import NewsCardShimmer from '../../../components/atoms/NewsCardShimmer';

const PAGE_SIZE = 10;

const Scheduled = ({ grid = false ,FilterOption}) => {
  const userData = useSelector(state => state.login.userData);
  const [storyData, setStoryData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  console.log('filterOption',FilterOption)

  const { loading, callApi } = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });

  const fetchData = useCallback(async (start = 0) => {
    if (!userData?.sessionId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const res = await callApi(null, FetchStoryApi(start, PAGE_SIZE, userData.sessionId));
    if (res?.news?.length > 0) {
      setStoryData(prev => [...prev, ...res.news]);
      setStartIndex(start + PAGE_SIZE);
    } else {
      setHasMore(false); // No more data to load
    }
    setLoadingMore(false);
  }, [userData, callApi, loadingMore, hasMore]);

  useEffect(() => {
    if (userData?.sessionId) {
      setStoryData([]);
      setStartIndex(0);
      setHasMore(true);
      fetchData(0);
    }
  }, [userData]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchData(startIndex);
    }
  };

  const RenderView = ({ item, index }) => (
    <NewsCard
      id={item?.newsId}
      image={item?.media?.[0]?.url}
      date={item?.date_news}
      author={item?.authorName}
      title={item?.heading}
      grid={grid}
    />
  );

  return (
   
      <Tabs.FlatList
        key={grid ? 'grid' : 'list'}
        data={storyData}
        renderItem={({ item, index }) => <RenderView item={item} index={index} />}
        keyExtractor={(item, index) => item?.newsId?.toString() || index.toString()}
        numColumns={grid ? 2 : 1}
        columnWrapperStyle={grid ? styles.rowWrapper : null}
        contentContainerStyle={{paddingBottom:40,paddingTop:FilterOption ? 560: 100,paddingHorizontal:10}}
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

export default Scheduled;

const styles = StyleSheet.create({
  rowWrapper: {
    justifyContent: 'space-between',
  },
});
