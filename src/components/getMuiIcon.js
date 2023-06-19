import AddIcon from '@mui/icons-material/Add';
import BedIcon from '@mui/icons-material/Bed';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsIcon from '@mui/icons-material/Directions';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import ExploreIcon from '@mui/icons-material/Explore';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LinkIcon from '@mui/icons-material/Link';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ParkIcon from '@mui/icons-material/Park';
import PlaceIcon from '@mui/icons-material/Place';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TvIcon from '@mui/icons-material/Tv';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';

export default function getMuiIcon(icon) {
  return ICON_MAP[icon];
}

const ICON_MAP = {
  baseball: SportsBaseballIcon,
  'bed-king-outline': BedIcon,
  'book-open-outline': MenuBookIcon,
  'chart-timeline': ViewTimelineIcon,
  'check-bold': DoneIcon,
  'checkbox-outline': CheckBoxIcon,
  'chevron-down': KeyboardArrowDownIcon,
  'close-circle': CancelIcon,
  compass: ExploreIcon,
  delete: DeleteIcon,
  directions: DirectionsIcon,
  'dots-vertical': MoreVertIcon,
  food: FastfoodIcon,
  'gamepad-variant': SportsEsportsIcon,
  link: LinkIcon,
  'map-marker': PlaceIcon,
  'medical-bag': MedicalServicesIcon,
  pencil: EditIcon,
  plus: AddIcon,
  'scale-bathroom': MonitorWeightIcon,
  star: StarIcon,
  'star-outline': StarBorderIcon,
  television: TvIcon,
  tree: ParkIcon,
  'view-column': ViewColumnIcon,
  wrench: BuildIcon,
};
