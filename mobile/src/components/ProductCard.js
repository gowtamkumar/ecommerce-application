import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { BASE_URL } from '../api/client';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 
    ? `${BASE_URL}/uploads/${product.images[0]}` 
    : 'https://via.placeholder.com/150';

  return (
    <StyledTouchableOpacity className="w-40 mr-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <StyledImage 
        source={{ uri: imageUrl }} 
        className="w-full h-40 bg-gray-50" 
        resizeMode="cover"
      />
      <StyledView className="p-3">
        <StyledText className="font-semibold text-gray-800 text-sm mb-1" numberOfLines={1}>
          {product.name}
        </StyledText>
        <StyledText className="text-xs text-gray-500 mb-2" numberOfLines={1}>
          {product.category?.name}
        </StyledText>
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="font-bold text-primary text-lg">
            ${product.price}
          </StyledText>
          {/* Add button placeholder */}
          <StyledView className="bg-black rounded-full w-6 h-6 items-center justify-center">
             <StyledText className="text-white text-xs">+</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default ProductCard;
