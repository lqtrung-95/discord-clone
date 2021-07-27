import { useQuery } from "react-query";
import { dmKey } from "utils/querykeys";

export default function useGetCurrentDM(channelId) {
  const { data } = useQuery(dmKey);
  return data?.find(channel => channel.id === channelId);
}
