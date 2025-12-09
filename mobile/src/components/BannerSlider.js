import React from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { BASE_URL } from '../api/client';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const { width } = Dimensions.get('window');

const BannerSlider = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <StyledView className="mb-6">
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        className="w-full"
      >
        {banners.map((banner, index) => (
          <StyledView key={index} style={{ width: width - 32 }} className="h-48 mr-4 rounded-2xl overflow-hidden relative bg-gray-800 ml-4 last:mr-4">
             <StyledImage 
                source={{ uri: `${BASE_URL}/uploads/${banner.image}` }} 
                className="w-full h-full opacity-70"
                resizeMode="cover"
              />
              <StyledView className="absolute inset-0 justify-center items-start p-6">
                <StyledText className="text-white font-bold text-2xl mb-2 w-3/4">
                  {banner.title}
                </StyledText>
                <StyledText className="text-gray-200 text-sm mb-4 w-3/4" numberOfLines={2}>
                  {banner.description}
                </StyledText>
                <StyledView className="bg-white px-4 py-2 rounded-full">
                  <StyledText className="font-bold text-black text-xs">Shop Now</StyledText>
                </StyledView>
              </StyledView>
          </StyledView>
        ))}
      </ScrollView>
    </StyledView>
  );
};

export default BannerSlider;
