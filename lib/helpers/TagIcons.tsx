import AnimeIcon from "@/components/icons/tags/AnimeIcon";
import AutographIcon from "@/components/icons/tags/AutographIcon";
import CollectibleIcon from "@/components/icons/tags/CollectibleIcon";
import ComicsIcon from "@/components/icons/tags/ComicsIcon";
import DefaultIcon from "@/components/icons/tags/DefaultIcon";
import PokemonIcon from "@/components/icons/tags/PokemonIcon";
import SportsIcon from "@/components/icons/tags/SportsIcon";
import ToyIcon from "@/components/icons/tags/ToyIcon";

const getTagIcon = (tag: string) => {
  switch (tag) {
    case "Pokemon":
      return <PokemonIcon />;
    case "Sports":
      return <SportsIcon />;
    case "Comics":
      return <ComicsIcon />;
    case "Toys":
      return <ToyIcon />;
    case "Collectibles":
      return <CollectibleIcon />;
    case "Autographs":
      return <AutographIcon />;
    case "Anime":
      return <AnimeIcon />;
    default:
      return <DefaultIcon />;
  }
};

export { getTagIcon };