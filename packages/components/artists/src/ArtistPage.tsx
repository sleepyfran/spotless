import { ActionIcon, Flex, Title } from "@mantine/core";
import { PageLayout, Paths } from "@spotless/components-shared";
import { Artist } from "@spotless/types";
import { IconArrowLeft } from "@tabler/icons-react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ArtistDetail } from "./ArtistDetail";
import { useEffect } from "react";

type ArtistPageProps = {
  /**
   * Artist to display.
   */
  artist: Artist;
};

export const ArtistPageRoute = () => {
  const artist = useLoaderData() as Artist;
  return <ArtistPage artist={artist} />;
};

export const ArtistPage = ({ artist }: ArtistPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout isLoading={false} title={<ArtistTitle artist={artist} />}>
      <ArtistDetail artist={artist} />
    </PageLayout>
  );
};

type ArtistTitleProps = {
  /**
   * Artist to display.
   */
  artist: Artist;
};

const ArtistTitle = ({ artist }: ArtistTitleProps) => {
  const navigate = useNavigate();

  const onBackClicked = () => {
    navigate(Paths.artists);
  };

  return (
    <Flex align="center" gap="md">
      <ActionIcon size="xl" onClick={onBackClicked}>
        <IconArrowLeft />
      </ActionIcon>
      <Title>{artist.name}</Title>
    </Flex>
  );
};
