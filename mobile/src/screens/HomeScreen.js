import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { getHome } from '../api/home';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import BannerSlider from '../components/BannerSlider';
import CategoryItem from '../components/CategoryItem';
import ProductCard from '../components/ProductCard';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const HomeScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getHome();
      setData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000000" />
      </StyledView>
    );
  }

  const sliderBanners = data?.banners?.filter(b => b.type === 'Slider') || [];
  const promoBanners = data?.banners?.filter(b => b.type === 'Banner') || [];

  return (
    <StyledSafeAreaView className="flex-1 bg-white pt-8">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <StyledView className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <StyledView className="flex-row items-center">
          <StyledView className="bg-black w-8 h-8 rounded-lg items-center justify-center mr-2">
            <StyledText className="text-white font-bold text-lg">E</StyledText>
          </StyledView>
          <StyledText className="text-xl font-bold text-black">Commerce</StyledText>
        </StyledView>
        <StyledView className="flex-row gap-4">
          <StyledTouchableOpacity>
            <Ionicons name="search-outline" size={24} color="black" />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity>
            <Ionicons name="cart-outline" size={24} color="black" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Slider */}
        <StyledView className="mt-4">
          <BannerSlider banners={sliderBanners} />
        </StyledView>

        {/* Categories */}
        <StyledView className="mb-6">
          <StyledView className="flex-row justify-between items-center px-4 mb-3">
            <StyledText className="text-lg font-bold text-gray-900">Shop by Category</StyledText>
            <StyledTouchableOpacity>
              <StyledText className="text-gray-500 text-sm">See All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {data?.categories?.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </ScrollView>
        </StyledView>

        {/* Featured Products */}
        <StyledView className="mb-6">
          <StyledView className="flex-row justify-between items-center px-4 mb-3">
            <StyledText className="text-lg font-bold text-gray-900">Featured Products</StyledText>
            <StyledTouchableOpacity>
              <StyledText className="text-gray-500 text-sm">View All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {data?.products?.data?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </StyledView>

        {/* Promo Banner */}
        {promoBanners.length > 0 && (
           <BannerSlider banners={[promoBanners[0]]} />
        )}

        {/* Top Selling */}
        <StyledView className="mb-8">
          <StyledView className="flex-row justify-between items-center px-4 mb-3">
            <StyledText className="text-lg font-bold text-gray-900">Top Selling</StyledText>
            <StyledTouchableOpacity>
              <StyledText className="text-gray-500 text-sm">View All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {data?.topSellingProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </StyledView>

      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default HomeScreen;
