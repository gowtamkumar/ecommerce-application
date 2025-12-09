import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { BASE_URL } from '../api/client';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CategoryItem = ({ category }) => {
  const imageUrl = category.image 
    ? `${BASE_URL}/uploads/${category.image}` 
    : 'https://via.placeholder.com/100';

  return (
    <StyledTouchableOpacity className="mr-4 items-center">
      <StyledView className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden mb-2 border border-gray-200">
        <StyledImage 
          source={{ uri: imageUrl }} 
          className="w-full h-full" 
          resizeMode="cover"
        />
      </StyledView>
      <StyledText className="text-xs font-medium text-gray-700 text-center w-20" numberOfLines={1}>
        {category.name}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default CategoryItem;
