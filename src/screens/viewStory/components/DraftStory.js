import { FlatList, ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Apptheme from '../../../assets/theme/Apptheme';
import Gap from '../../../components/atoms/Gap';
import NewsCard from '../../../components/molecules/NewsCard';
import useApi from '../../../apiServices/UseApi';
import { DraftStoryApi, FetchStoryApi } from '../../../apiServices/apiHelper';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 10;

const DraftStory = ({ grid = false }) => {
  const userData = useSelector(state => state.login.userData);
  const [storyData, setStoryData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { loading, callApi } = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });


  console.log('startIndex',startIndex)
  const fetchData = useCallback(async (start = 0) => {
    if (!userData?.sessionId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const res = await callApi(null, DraftStoryApi(start, PAGE_SIZE, userData.sessionId));
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
    <View
      style={{
        backgroundColor: Apptheme.color.containerBackground,
        paddingHorizontal: 10,
        flex: 1,
      }}>
        {storyData?.length==0 ?
      <View>
        <Gap ml/>
        <Gap ml/>
        <Gap ml/>
        <ActivityIndicator size="large" color={Apptheme.color.primary} />
      </View>  
     : 
      <FlatList
        key={grid ? 'grid' : 'list'}
        data={storyData}
        renderItem={({ item, index }) => <RenderView item={item} index={index} />}
        keyExtractor={(item, index) => item?.newsId?.toString() || index.toString()}
        numColumns={grid ? 2 : 1}
        columnWrapperStyle={grid ? styles.rowWrapper : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <>
            <Gap m4/>
            <ActivityIndicator size="large" color={Apptheme.color.primary} />
            </>
          ) : null
        }
      />
}
      <Gap ml />
    </View>
  );
};


export default DraftStory;

const styles = StyleSheet.create({
  rowWrapper: {
    justifyContent: 'space-between',
  },
});
