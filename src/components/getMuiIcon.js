import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CropFreeIcon from '@mui/icons-material/CropFree';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DoneIcon from '@mui/icons-material/Done';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import ExploreIcon from '@mui/icons-material/Explore';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import LinkIcon from '@mui/icons-material/Link';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SportsBaseballOutlinedIcon from '@mui/icons-material/SportsBaseballOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TvIcon from '@mui/icons-material/Tv';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined';

export default function getMuiIcon(icon) {
  return MUI_NAME_TO_COMPONENT_MAP[icon];
}

// find more at https://mui.com/material-ui/material-icons/?theme=Outlined
const MUI_NAME_TO_COMPONENT_MAP = {
  'arrow-back': ArrowBackIcon,
  'sports-baseball': SportsBaseballOutlinedIcon,
  bed: BedOutlinedIcon,
  'drag-handle': DragHandleIcon,
  'menu-book': MenuBookIcon,
  'view-timeline': ViewTimelineOutlinedIcon,
  'check-bold': DoneIcon,
  'check-box': CheckBoxOutlinedIcon,
  'close-circle': CancelIcon,
  compass: ExploreIcon,
  delete: DeleteIcon,
  directions: DirectionsIcon,
  'directions-car': DirectionsCarFilledOutlinedIcon,
  'dots-square': CropFreeIcon,
  'dots-vertical': MoreVertIcon,
  fastfood: FastfoodOutlinedIcon,
  'sports-esports': SportsEsportsOutlinedIcon,
  link: LinkIcon,
  'paid-outlined': PaidOutlinedIcon,
  place: PlaceOutlinedIcon,
  'medical-services': MedicalServicesOutlinedIcon,
  pencil: EditIcon,
  plus: AddIcon,
  'monitor-weight': MonitorWeightOutlinedIcon,
  run: DirectionsRunIcon,
  square: SquareIcon,
  star: StarIcon,
  'star-outline': StarBorderIcon,
  tv: TvIcon,
  park: ParkOutlinedIcon,
  'view-column': ViewColumnOutlinedIcon,
  wrench: BuildIcon,
};
