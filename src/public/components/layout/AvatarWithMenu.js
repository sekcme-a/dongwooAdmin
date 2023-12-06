import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import { auth } from "firebase/firebase";

import useData from "context/data";
import useUserData from "context/userData";

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';

const AvatarWithMenu = (props) => {
  const { team } = useData()
  const router = useRouter()
  const {id} = router.query

  const onLogoutClick = () => {
    auth.signOut()
    router.push("/")
  }

  //mui control---------
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //----------------muicontrol

  const onClick = (loc) => {
    router.push(`/${team.teamId}/${loc}`)
  }
  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar alt="Admin Avatar" src={props.photo ? props.photo : "/default_avatar.png"}/>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '& .MuiList-root': {
              width: 170,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem onClick={()=>onClick("profile")}>
          <Avatar alt="Admin Avatar" src={props.photo} /> 프로필
        </MenuItem> */}

        {/* <MenuItem>
          <Avatar /> My account
        </MenuItem> */}
        <Divider />
        <MenuItem style={{height:"33px"}} onClick={()=>onClick("/team/manageTeam")}>
          <ListItemIcon>
            <GroupIcon fontSize="small" />
          </ListItemIcon>
          구성원 관리
        </MenuItem>
        {/* <MenuItem style={{height:"33px"}}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem onClick={()=>router.push("/auth/hallway")} style={{height:"33px"}}>
          <ListItemIcon>
            <Groups2OutlinedIcon fontSize="small" />
          </ListItemIcon>
          팀 변경
        </MenuItem>
        <MenuItem onClick={onLogoutClick} style={{height:"33px"}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </>
  )
}

export default AvatarWithMenu