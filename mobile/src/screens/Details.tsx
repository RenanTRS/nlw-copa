import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useShowToast } from "../hooks/useShowToast";
import { Share } from "react-native";

import { api } from "../services/api";

import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { HStack, VStack } from "native-base";
import { Header } from "../components/Header";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
  const [optionSelected, setOptionSelected] = useState<'guess' | 'ranking'>('guess');
  
  const route = useRoute();
  const showToast = useShowToast();

  const { id } = route.params as RouteParams;

  const fetchPoolDetails = async () => {
    try {
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (err) {
      console.log(err);
      showToast.error('Não foi possível carregar os detalhes do bolão!');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCodeShare = async () => {
    await Share.share({
      message: poolDetails.code
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare} />

      {poolDetails._count?.participants > 0 ? 
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option 
              title="Seus palpites" 
              isSelected={optionSelected === "guess"}  
              onPress={() => setOptionSelected('guess')}
            />
            <Option 
              title="Ranking do grupo" 
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")} 
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack> 
      
        : <EmptyMyPoolList code={poolDetails.code} />
      }

    </VStack>
  );
}