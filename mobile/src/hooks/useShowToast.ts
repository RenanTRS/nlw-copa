import { useToast } from "native-base";

export function useShowToast() {
  const toast = useToast();

  const confirm = (message: string) => {  
    toast.show({
      title: message,
      placement: 'top',
      bgColor: 'green.500'
    });
  }
  
  const error = (message: string) => {  
    toast.show({
      title: message,
      placement: 'top',
      bgColor: 'red.500'
    });
  }

  return {confirm, error}
}