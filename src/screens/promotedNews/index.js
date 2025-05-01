import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Apptheme from '../../assets/theme/Apptheme'
import FontStyle from '../../assets/theme/FontStyle'
import VectorIcon from '../../assets/vectorIcons'
import { useNavigation } from '@react-navigation/native'
import DropdownWithModal from '../../components/atoms/DropdownWithModal'

const PromotedNews = () => {
    const navigation = useNavigation()
    console.log('hello123456')
  return (
    <View style={{flex:1}}>
      <View style={{padding:Apptheme.spacing.marginHorizontal,backgroundColor:Apptheme.color.primary,flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <VectorIcon material-icon name='arrow-back-ios' color={Apptheme.color.background} size={18} style={{marginRight:10}}/>
        </TouchableOpacity>
      <Text style={[FontStyle.headingLarge,{color:Apptheme.color.background}]}>PromotedNews</Text>
      </View>  
      <ScrollView style={{padding:Apptheme.spacing.marginHorizontal}}>
      <DropdownWithModal
        label="Select Category"
        options={[
          { label: 'Technology', value: 'tech' },
          { label: 'Business', value: 'biz' },
        ]}
        onSelect={(val) => console.log('Category:', val)}
      />
      <DropdownWithModal
        label="Select Location"
        options={[
          { label: 'New York', value: 'ny' },
          { label: 'Los Angeles', value: 'la' },
        ]}
        onSelect={(val) => console.log('Location:', val)}
      />
      </ScrollView>
    </View>
  )
}

export default PromotedNews

const styles = StyleSheet.create({})