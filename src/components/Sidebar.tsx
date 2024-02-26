
import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Box, Drawer, IconButton, List, ListItem, ListItemIcon, Popover, Toolbar, Tooltip, Typography } from '@mui/material';
import { FaAddressBook, FaBars, FaBriefcase, FaBuilding, FaChartLine, FaCog, FaDiceD6, FaHandshake, FaIndustry, FaSignOutAlt, FaTachometerAlt, FaUserFriends, FaUsers } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from './FetchData';
import { ProfileUrl } from '../services/ApiUrls';
import { Header1 } from './FetchData';
import OrganizationModal from '../pages/organization/OrganizationModal';
import Leads from '../pages/leads/Leads';
import { EditLead } from '../pages/leads/EditLead';
import LeadDetails from '../pages/leads/LeadDetails';
import Users from '../pages/users/Users';
import Opportunities from '../pages/opportunities/Opportunities';
import Cases from '../pages/cases/Cases';
import { AddLeads } from '../pages/leads/AddLeads';
import Accounts from '../pages/accounts/Accounts';
import { AddAccount } from '../pages/accounts/AddAccount';
import { EditAccount } from '../pages/accounts/EditAccount';
import { AccountDetails } from '../pages/accounts/AccountDetails';
import { AddUsers } from '../pages/users/AddUsers';
import { EditUser } from '../pages/users/EditUser';
import UserDetails from '../pages/users/UserDetails';
import { AddOpportunity } from '../pages/opportunities/AddOpportunity';
import { EditOpportunity } from '../pages/opportunities/EditOpportunity';
import { OpportunityDetails } from '../pages/opportunities/OpportunityDetails';
import { AddCase } from '../pages/cases/AddCase';
import { EditCase } from '../pages/cases/EditCase';
import { CaseDetails } from '../pages/cases/CaseDetails';
import logo from '../assets/images/auth/img_logo.png';
import { StyledListItemButton, StyledListItemText } from '../styles/CssStyled';
import MyContext from '../context/Context';


export default function Sidebar(props: any) {
    const navigate = useNavigate()
    const location = useLocation()
    const [screen, setScreen] = useState('leads')
    const [drawerWidth, setDrawerWidth] = useState(200)
    const [userDetail, setUserDetail] = useState('')
    const [organizationModal, setOrganizationModal] = useState(false)
    const organizationModalClose = () => { setOrganizationModal(false) }

    useEffect(() => {
        toggleScreen()
    }, [navigate])


    const toggleScreen = () => {
        if (location.pathname.split('/')[1] === '' || location.pathname.split('/')[1] === undefined || location.pathname.split('/')[2] === 'leads') {
            setScreen('leads')
        } else if (location.pathname.split('/')[2] === 'opportunities') {
            setScreen('opportunities')
        } else if (location.pathname.split('/')[2] === 'accounts') {
            setScreen('accounts')
        } else if (location.pathname.split('/')[2] === 'users') {
            setScreen('users')
        } else if (location.pathname.split('/')[2] === 'cases') {
            setScreen('cases')
        }
    }


    const userProfile = () => {
        fetchData(`${ProfileUrl}/`, 'GET', null as any, Header1)
            .then((res: any) => {
                if (res?.user_obj) {
                    setUserDetail(res?.user_obj)
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    const navList = ['leads', 'opportunities', 'accounts', 'users', 'cases']
    const navIcons = (text: any, screen: any): React.ReactNode => {
        switch (text) {
            case 'leads':
                return screen === 'leads' ? <FaUsers fill='#3e79f7' /> : <FaUsers />
            case 'opportunities':
                return screen === 'opportunities' ? <FaHandshake fill='#3e79f7' /> : <FaHandshake />
            case 'accounts':
                return screen === 'accounts' ? <FaBuilding fill='#3e79f7' /> : <FaBuilding />
            case 'users':
                return screen === 'users' ? <FaUserFriends fill='#3e79f7' /> : <FaUserFriends />
            case 'cases':
                return screen === 'cases' ? <FaBriefcase fill='#3e79f7' /> : <FaBriefcase />
            default: return <FaDiceD6 fill='#3e79f7' />
        }
    }


    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        userProfile();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // console.log(screen, 'sidebar');
    const context = { drawerWidth: drawerWidth, screen: screen }
    return (
        <>
            <Box>
                <AppBar position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        height: '60px',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // boxShadow: 'none',
                        // borderBottom: `0.5px solid #0000001f`
                        boxShadow: '1px'
                    }}
                >
                    <Box>
                        <Toolbar>
                            {drawerWidth === 60 ? <img src={logo} width={'40px'} style={{ transform: 'rotate(270deg)', marginLeft: '-15px', marginRight: '10px' }} /> : <img src={logo} width={'100px'} style={{ marginLeft: '-5px', marginRight: '30px' }} />}
                            <IconButton sx={{ ml: '-10px' }} onClick={() => setDrawerWidth(drawerWidth === 60 ? 200 : 60)}>
                                <FaBars style={{ height: '20px' }} />
                            </IconButton>
                            <Typography sx={{ fontWeight: 'bold', color: 'black', ml: '20px', textTransform: 'capitalize', fontSize: '20px', mt: '5px' }}>
                                {screen}
                            </Typography>
                        </Toolbar>
                    </Box>
                    <Box style={{
                        marginRight: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <IconButton onClick={handleClick} sx={{ mr: 3 }}>
                            <Avatar
                                sx={{ height: '27px', width: '27px' }}
                            />
                        </IconButton>
                        <Popover
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                        >
                            <List disablePadding>
                                <ListItem disablePadding>
                                    <StyledListItemButton onClick={() => {
                                        localStorage.clear()
                                        navigate('/login')
                                    }}>
                                        <ListItemIcon > <FaSignOutAlt fill='#3e79f7' /></ListItemIcon>
                                        <StyledListItemText primary={'Sign out'} sx={{ ml: '-20px', color: '#3e79f7' }} />
                                    </StyledListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <StyledListItemButton onClick={() => setOrganizationModal(!organizationModal)}>
                                        <ListItemIcon > <FaIndustry fill='#3e79f7' /></ListItemIcon>
                                        <StyledListItemText primary={'Organization'} sx={{ ml: '-20px', color: '#3e79f7' }} />
                                    </StyledListItemButton>
                                </ListItem>
                            </List>
                        </Popover>
                    </Box>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                    }}
                >
                    <Box>
                        <List sx={{ pt: '65px' }}>
                            {navList.map((text, index) => (
                                <ListItem key={text} disablePadding  >
                                    <StyledListItemButton
                                        sx={{ pt: '6px', pb: '6px' }}
                                        onClick={() => {
                                            navigate(`/app/${text}`)
                                            setScreen(text)
                                        }}
                                        selected={screen === text}
                                    >
                                        <ListItemIcon sx={{ ml: '5px' }}>
                                            {navIcons(text, screen)}
                                        </ListItemIcon>
                                        <StyledListItemText primary={text} sx={{ ml: -2, textTransform: 'capitalize' }} />
                                    </StyledListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                </Drawer>
                <MyContext.Provider value={context}>
                    <Box sx={{ width: 'auto', ml: drawerWidth === 60 ? '60px' : '200px', overflowX: 'hidden' }}>
                        <Routes>
                            <Route index element={<Leads />} />
                            <Route path='/app/leads' element={<Leads />} />
                            <Route path='/app/leads/add-leads' element={<AddLeads />} />
                            <Route path='/app/leads/edit-lead' element={<EditLead />} />
                            <Route path='/app/leads/lead-details' element={<LeadDetails />} />
                            <Route path='/app/accounts' element={<Accounts />} />
                            <Route path='/app/accounts/add-account' element={<AddAccount />} />
                            <Route path='/app/accounts/account-details' element={<AccountDetails />} />
                            <Route path='/app/accounts/edit-account' element={<EditAccount />} />
                            <Route path='/app/users' element={<Users />} />
                            <Route path='/app/users/add-users' element={<AddUsers />} />
                            <Route path='/app/users/edit-user' element={<EditUser />} />
                            <Route path='/app/users/user-details' element={<UserDetails />} />
                            <Route path='/app/opportunities' element={<Opportunities />} />
                            <Route path='/app/opportunities/add-opportunity' element={<AddOpportunity />} />
                            <Route path='/app/opportunities/opportunity-details' element={<OpportunityDetails />} />
                            <Route path='/app/opportunities/edit-opportunity' element={<EditOpportunity />} />
                            <Route path='/app/cases' element={<Cases />} />
                            <Route path='/app/cases/add-case' element={<AddCase />} />
                            <Route path='/app/cases/edit-case' element={<EditCase />} />
                            <Route path='/app/cases/case-details' element={<CaseDetails />} />
                        </Routes>
                    </Box>
                </MyContext.Provider>
                <OrganizationModal
                    open={organizationModal}
                    handleClose={organizationModalClose}
                />
            </Box >
        </>

    )
}

