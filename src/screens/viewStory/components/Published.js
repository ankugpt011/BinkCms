import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Apptheme from '../../../assets/theme/Apptheme'
import NewsCard from '../../../components/molecules/NewsCard'
import Gap from '../../../components/atoms/Gap'

const Published = ({grid}) => {
  const RenderView = () => {
    return (
      <NewsCard
        id={'426398'}
        image={
          'https://janmunicsite.hocalwire.in/h-upload/2025/03/25/500x300_339345-26aac9bb-53c4-4fef-aff2-3c185598f5ad1742801232253.webp?time=1743747569972'
        }
        date={'Mar 26,2025 2:26 PM'}
        author={'Archana'}
        title={
          'मुजफ्फरनगर में वैगन की टक्कर से की-मैन की मौत पर हंगामा, गोल्डन टैंपल रोकी'
        }
        grid={grid}
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: Apptheme.color.containerBackground,
        paddingHorizontal:10
      }}>
      <FlatList
       key={grid ? 'grid' : 'list'}
        data={[1, 2, 3, 4, 5]}
        renderItem={RenderView}
        keyExtractor={(item, index) => index.toString()}
        numColumns={grid ? 2 : 1}
        columnWrapperStyle={grid ? styles.rowWrapper : null} 
      />
      <Gap ml />
    </View>
  );
}

export default Published

const styles = StyleSheet.create({
  rowWrapper: {
    justifyContent: 'space-between', // Ensures spacing in grid view
  },
})