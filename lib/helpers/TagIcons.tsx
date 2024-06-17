import AnimeIcon from "@/components/icons/tags/AnimeIcon";
import AutographIcon from "@/components/icons/tags/AutographIcon";
import CollectibleIcon from "@/components/icons/tags/CollectibleIcon";
import ComicsIcon from "@/components/icons/tags/ComicsIcon";
import DefaultIcon from "@/components/icons/tags/DefaultIcon";
import OnePieceIcon from "@/components/icons/tags/OnePiece";
import PokemonIcon from "@/components/icons/tags/PokemonIcon";
import SportsIcon from "@/components/icons/tags/SportsIcon";
import TCGIcon from "@/components/icons/tags/TCGIcon";
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
    case "One-Piece":
      return <OnePieceIcon />;
    case "TCG":
      return <TCGIcon />;
    default:
      return <DefaultIcon />;
  }
};

const getTagColor = (tag: string) => {
  switch (tag) {
    case "Pokemon":
      return "#ffd65b";
    case "Sports":
      return "#ff814a";
    case "Comics":
      return "#00449e";
    case "Toys":
      return "#ff59b9";
    case "Collectibles":
      return "#c362dd";
    case "Autographs":
      return "#00bac2";
    case "Anime":
      return "#00449e";
    case "One-Piece":
      return "#ff001b";
    case "TCG":
      return "#117cae";
    default:
      return "#70cf8c";
  }
};

export { getTagIcon, getTagColor };
