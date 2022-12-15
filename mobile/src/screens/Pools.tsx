import { useState, useCallback } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { PoolCard, PoolPros } from "../components/PoolCard";
import { useFocusEffect } from "@react-navigation/native";

import { Octicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import { api } from "../services/api";

export function Pools() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<PoolPros[]>([]);

  const toast = useToast();
  const { navigate } = useNavigation();

  const fetchPools = async () => {
    try {
      setIsLoading(true);
      
      const response = await api.get('/pools');
      
      setPools(response.data.pools);
    } catch (err) {
      console.log(err);

      toast.show({
        title: 'Não foi possível carregar os botões',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
          title="BUSCAR BOLÃO POR CÓDIGO" 
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>
      
      { isLoading ? <Loading /> :
        <FlatList 
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({item}) => <PoolCard data={item} />}
          px={5}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{pb: 20}}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      }

    </VStack>
  );
}