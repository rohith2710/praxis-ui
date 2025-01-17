// TODO: Add remaining layout and functionality - below is a WIP

import { Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useGroupProfileQuery } from "../../apollo/gen";
import GroupProfileCard from "../../components/Groups/GroupProfileCard";
import Feed from "../../components/Shared/Feed";
import ProgressBar from "../../components/Shared/ProgressBar";
import ToggleForms from "../../components/Shared/ToggleForms";
import { isDeniedAccess } from "../../utils/error.utils";

const GroupPage: NextPage = () => {
  const { query } = useRouter();
  const name = String(query?.name || "");
  const { data, loading, error } = useGroupProfileQuery({
    variables: { name },
    errorPolicy: "all",
    skip: !name,
  });

  const { t } = useTranslation();

  if (loading) {
    return <ProgressBar />;
  }

  if (!data) {
    if (isDeniedAccess(error)) {
      return <Typography>{t("prompts.permissionDenied")}</Typography>;
    }

    if (error) {
      return <Typography>{t("errors.somethingWentWrong")}</Typography>;
    }
    return null;
  }

  const { group, me } = data;
  const currentMemberId =
    me && group.members.find((member) => member.id === me.id)?.id;

  return (
    <>
      <GroupProfileCard group={group} currentMemberId={currentMemberId} />

      {currentMemberId && <ToggleForms groupId={group.id} me={me} />}

      <Feed feed={group.feed} />
    </>
  );
};

export default GroupPage;
