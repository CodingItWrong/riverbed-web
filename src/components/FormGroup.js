import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';

export default function FormGroup({title, children}) {
  return (
    <>
      <Divider />
      <ListSubheader component="div">{title}</ListSubheader>
      {children}
      <Divider />
    </>
  );
}
