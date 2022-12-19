import { useState } from "react";
import { Heading, VStack } from "native-base";
import { useShowToast } from "../hooks/useShowToast";
import { useNavigation } from "@react-navigation/native";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Find() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [poolCode, setPoolCode] = useState<string>('');

  const { navigate } = useNavigation();

  const showToast = useShowToast();

  const handleJoinPool = async () => {
    try {
      setIsLoading(true);

      if (!poolCode.trim()) {
        return showToast.error('Informe o código do bolão');
      }

      await api.post('/pools/join', {code: poolCode});
      navigate('pools');

      showToast.confirm('Bolão encontrado com sucesso!');
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      
      if (err.response?.data?.message === 'Pool not found.') {
        return showToast.error('Bolão não encontrado');
      }

      if (err.response?.data?.message === 'You already joined this pool.') {
        return showToast.error('Você já está nesse bolão!');
      }
      
      showToast.error('Não foi possível encontrar o bolão!');
    }
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através {'\n'}de seu código único 
        </Heading>

        <Input 
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setPoolCode}
          autoCapitalize="characters"
        />

        <Button 
          title="BUSCAR BOLÃO" 
          isLoading={isLoading}
          onPress={handleJoinPool}
        />

      </VStack>

    </VStack>
  );
}