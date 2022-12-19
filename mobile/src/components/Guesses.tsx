import { useEffect, useState } from "react";
import { useShowToast } from "../hooks/useShowToast";
import { FlatList } from "native-base";

import { api } from "../services/api";

import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Game, GameProps } from "./Game";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState<string>('');
  const [secondTeamPoints, setSecondTeamPoints] = useState<string>('');
  const showToast = useShowToast();

  const fetchGames = async () => {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);

    } catch (err) {
      console.log(err);
      showToast.error('Não foi possível carregar os dados do bolão');

    } finally {
      setIsLoading(false);
    }
  }

  const handleGuessConfirm = async (gameId: string) => {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return showToast.error('Informe o placar do palpite');
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });

      showToast.confirm('Palpite realizado com sucesso!');

      fetchGames();

    } catch (err) {
      console.log(err);
      showToast.error('Não foi possível enviar o palpite!');
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Game
        data={item}
        setFirstTeamPoints={setFirstTeamPoints}
        setSecondTeamPoints={setSecondTeamPoints}
        onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
        )}
        _contentContainerStyle={{pb: 20}}
        ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
        showsHorizontalScrollIndicator={false}
    />
  );
}
