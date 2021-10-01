import { GridItem, UnorderedList } from "@chakra-ui/react";
import { getGuildMembers } from "api/handler/guilds";
import useMemberSocket from "api/ws/useMemberSocket";
import MemberListItem from "components/items/MemberListItem";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { mKey } from "utils/querykeys";
import OnlineLabel from "components/sections/OnlineLabel";
import memberScrollbarCss from "./css/MemberScrollerCSS";

export default function MemberList() {
  const { guildId } = useParams();
  const key = mKey(guildId);
  const { data } = useQuery(key, () =>
    getGuildMembers(guildId).then(res => res.data)
  );

  const online = [];
  const offline = [];

  if (data) {
    data.forEach(member => {
      if (member.isOnline) {
        online.push(member);
      } else {
        offline.push(member);
      }
    });
  }

  useMemberSocket(guildId, key);

  return (
    <GridItem
      gridColumn={4}
      gridRow={"1 / 4"}
      bg="memberList"
      overflowY="hidden"
      _hover={{ overflowY: "auto" }}
      css={memberScrollbarCss}
    >
      <UnorderedList listStyleType="none" ml="0">
        <OnlineLabel label={`online—${online.length}`} />
        {online.map(m => (
          <MemberListItem key={m.id} member={m} />
        ))}
        <OnlineLabel label={`offline—${offline.length}`} />
        {offline.map(m => (
          <MemberListItem key={m.id} member={m} />
        ))}
      </UnorderedList>
    </GridItem>
  );
}
