import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
  styled
} from '@mui/material';
import { Link } from 'react-router-dom';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import SimpleBar from 'simplebar-react';


// import avatar2 from '../../assets/imgs/users/avatar-2.jpg';
// import avatar8 from '../../assets/imgs/users/avatar-8.jpg';
// import avatar3 from '../../assets/imgs/users/avatar-3.jpg';
// import avatar6 from '../../assets/imgs/users/avatar-6.jpg';
import bell from '../../assets/imgs/svg/bell.svg';
import { Notifications } from '@mui/icons-material';

const useStyles = styled((theme) => ({
  root: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatar: {
    width: 4,
    height: 4
  },
  link: {
    textDecoration: 'none',
    color: 'red',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  formCheck: {
    marginRight: 1
  },
  viewAllButton: {
    marginTop: 2
  },
  emptyNotifications: {
    width: '25%',
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
    paddingTop: 3,
    margin: 'auto',
  },
  emptyNotificationsImage: {
    width: '100%',
    maxWidth: 200,
  },
  emptyNotificationsText: {
    marginTop: 2,
    marginBottom: 5,
    fontWeight: 'bold',
  },
}));

const NotificationDropdown = () => {
  const classes = useStyles();

  const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
  const toggleNotificationDropdown = () => {
    setIsNotificationDropdown(!isNotificationDropdown);
  };

  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className={classes.root}>
      <IconButton
        className={classes.button}
        onClick={toggleNotificationDropdown}
      >
        <Badge badgeContent={3} color="secondary" overlap="circular">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isNotificationDropdown}
        onClose={toggleNotificationDropdown}
      >
        <div className={classes.dropdownHead}>
          <div className={classes.dropdownHeadContent}>
            <Typography variant="h6" className={classes.title}>
              Notifications
            </Typography>
            <div className={classes.badgeContainer}>
              <Badge badgeContent={4} color="light" className={classes.badge}>
                <Typography variant="body2">New</Typography>
              </Badge>
            </div>
          </div>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => toggleTab(newValue)}
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab label="All (4)" value="1" />
            <Tab label="Messages" value="2" />
            <Tab label="Alerts" value="3" />
          </Tabs>
        </div>

        <SimpleBar style={{ maxHeight: 300 }}>
          {activeTab === '1' && (
            <div className={classes.tabContent}>
              <div className={classes.notificationItem}>
                <div className={classes.notificationItemContent}>
                  <div className={classes.avatar}>
                    <Avatar>
                      <Notifications />
                    </Avatar>
                  </div>
                  <div className={classes.flex1}>
                    <Link to="#" className={classes.link}>
                      <Typography variant="subtitle1" component="h6">
                        Your <b>Elite</b> author Graphic Optimization{' '}
                        <span className={classes.textSecondary}>reward</span>{' '}
                        is ready!
                      </Typography>
                    </Link>
                    <Typography
                      variant="body2"
                      className={classes.textMuted}
                    >
                      <span>
                        <i className="mdi mdi-clock-outline"></i> Just 30 sec
                        ago
                      </span>
                    </Typography>
                  </div>
                  <div className={classes.checkboxContainer}>
                    <Checkbox className={classes.formCheck} />
                  </div>
                </div>
              </div>
              {/* Other notification items */}
              {/* View all button */}
              <Button
                variant="text"
                color="primary"
                className={classes.viewAllButton}
              >
                View All Notifications
              </Button>
            </div>
          )}

          {activeTab === '2' && (
            <div className={classes.tabContent}>
              <div className={classes.notificationItem}>
                <div className={classes.notificationItemContent}>
                  <div className={classes.avatar}>
                    {/* <Avatar src={avatar3} /> */}
                  </div>
                  <div className={classes.flex1}>
                    <Link to="#" className={classes.link}>
                      <Typography variant="subtitle1" component="h6">
                        James Lemire
                      </Typography>
                    </Link>
                    <div className={classes.textMuted}>
                      <Typography variant="body2" component="p">
                        We talked about a project on LinkedIn.
                      </Typography>
                      <Typography variant="body2">
                        <span>
                          <i className="mdi mdi-clock-outline"></i> 30 min ago
                        </span>
                      </Typography>
                    </div>
                  </div>
                  <div className={classes.checkboxContainer}>
                    <Checkbox className={classes.formCheck} />
                  </div>
                </div>
              </div>
              {/* Other notification items */}
              {/* View all button */}
              <Button
                variant="text"
                color="primary"
                className={classes.viewAllButton}
              >
                View All Messages
              </Button>
            </div>
          )}

          {activeTab === '3' && (
            <div className={classes.tabContent}>
              <div className={classes.emptyNotifications}>
                <img
                  src={bell}
                  alt="user-pic"
                  className={classes.emptyNotificationsImage}
                />
                <Typography
                  variant="subtitle1"
                  component="h6"
                  className={classes.emptyNotificationsText}
                >
                  Hey! You have no notifications.
                </Typography>
              </div>
            </div>
          )}
        </SimpleBar>
      </Menu>
    </div>
  );
};

export default NotificationDropdown;
