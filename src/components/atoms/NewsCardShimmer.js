import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const NewsCardShimmer = ({ grid }) => {
  return (
    <View style={[styles.card, { width: grid ? '48.5%' : '100%' }]}>
      <ShimmerPlaceholder
        style={styles.image}
        shimmerStyle={{ borderRadius: 4 }}
        LinearGradient={LinearGradient}
      />

      <View style={{ marginTop: 10 }}>
        <ShimmerPlaceholder
          style={{ height: 10, width: '60%', borderRadius: 4 }}
          LinearGradient={LinearGradient}
        />
        <View style={{ height: 6 }} />
        <ShimmerPlaceholder
          style={{ height: 20, width: '90%', borderRadius: 4 }}
          LinearGradient={LinearGradient}
        />
        <View style={{ height: 6 }} />
        <ShimmerPlaceholder
          style={{ height: 20, width: '50%', borderRadius: 4 }}
          LinearGradient={LinearGradient}
        />
      </View>
    </View>
  );
};

export default NewsCardShimmer;

const styles = StyleSheet.create({
  card: {
    height: 270,
    marginTop: 10,
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  image: {
    height: 150,
    width: '100%',
    borderRadius: 6,
  },
});
