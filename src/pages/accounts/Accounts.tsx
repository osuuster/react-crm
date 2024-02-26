import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Box, Button, Stack, Tab, Table, TableBody, TableContainer, TableRow, Tabs, Typography, Paper, TableCell, IconButton, Checkbox, Tooltip, TableSortLabel, alpha, MenuItem, Select, Avatar, Fab, Container, TextField } from '@mui/material'
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FiChevronLeft } from "@react-icons/all-files/fi/FiChevronLeft";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp";
import { CustomTab, CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';
import { getComparator, stableSort } from '../../components/Sorting';
import { FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { AccountsUrl } from '../../services/ApiUrls';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../../components/DeleteModal';
import { Spinner } from '../../components/Spinner';
import '../../styles/style.css';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';

interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'user_name',
        numeric: false,
        disablePadding: false,
        label: 'Name'
    },
    {
        id: 'website',
        numeric: false,
        disablePadding: false,
        label: 'Website'
    },
    {
        id: 'created_by',
        numeric: true,
        disablePadding: false,
        label: 'Created By'
    },
    {
        id: 'country',
        numeric: true,
        disablePadding: false,
        label: 'Country'
    },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Actions'
    }
]


type Item = {
    id: string;
};
export default function Accounts() {
    const navigate = useNavigate()

    const [tab, setTab] = useState('open');
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('Website')
    const [selectOpen, setSelectOpen] = useState(false);

    const [status, setStatus] = useState([])
    const [users, setUsers] = useState([])
    const [countries, setCountries] = useState([])
    const [leads, setLeads] = useState([])

    const [openAccounts, setOpenAccounts] = useState<Item[]>([])
    const [closedAccounts, setClosedAccounts] = useState<Item[]>([])
    const [deleteRowModal, setDeleteRowModal] = useState(false)

    const [selected, setSelected] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);

    const [openCurrentPage, setOpenCurrentPage] = useState<number>(1);
    const [openRecordsPerPage, setOpenRecordsPerPage] = useState<number>(10);
    const [openTotalPages, setOpenTotalPages] = useState<number>(0);
    const [openLoading, setOpenLoading] = useState(true);


    const [closedCurrentPage, setClosedCurrentPage] = useState<number>(1);
    const [closedRecordsPerPage, setClosedRecordsPerPage] = useState<number>(10);
    const [closedTotalPages, setClosedTotalPages] = useState<number>(0);
    const [closedLoading, setClosedLoading] = useState(true);

    useEffect(() => {
        getAccounts()
    }, [openCurrentPage, openRecordsPerPage, closedCurrentPage, closedRecordsPerPage]);

    const handleChangeTab = (e: SyntheticEvent, val: any) => {
        setTab(val)
    }

    const getAccounts = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        try {
            const openOffset = (openCurrentPage - 1) * openRecordsPerPage;
            const closeOffset = (closedCurrentPage - 1) * closedRecordsPerPage;
            await fetchData(`${AccountsUrl}/?offset=${tab === "open" ? openOffset : closeOffset}&limit=${tab === "open" ? openRecordsPerPage : closedRecordsPerPage}`, 'GET', null as any, Header)
                .then((res: any) => {
                    if (!res.error) {
                        setOpenAccounts(res?.active_accounts?.open_accounts)
                        setClosedAccounts(res?.closed_accounts?.close_accounts)
                        setUsers(res?.users)
                        setStatus(res?.status)
                        setCountries(res?.countries)
                        setLeads(res?.leads)
                        setLoading(false)
                    }
                })
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    const accountDetail = (accountId: any) => {
        navigate(`/app/accounts/account-details`, { state: { accountId, detail: true, status: status || [], users: users || [], countries: countries || [], leads: leads || [] } })
    }
    const handleRecordsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (tab == 'open') {
            setOpenLoading(true)
            setOpenRecordsPerPage(parseInt(event.target.value));
            setOpenCurrentPage(1);
        } else {
            setClosedLoading(true)
            setClosedRecordsPerPage(parseInt(event.target.value));
            setClosedCurrentPage(1);
        }

    };
    const handlePreviousPage = () => {
        if (tab == 'open') {
            setOpenLoading(true)
            setOpenCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        } else {
            setClosedLoading(true)
            setClosedCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (tab == 'open') {
            setOpenLoading(true)
            setOpenCurrentPage((prevPage) => Math.min(prevPage + 1, openTotalPages));
        } else {
            setClosedLoading(true)
            setClosedCurrentPage((prevPage) => Math.min(prevPage + 1, closedTotalPages));
        }
    };
    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }


    const onAddAccount = () => {
        if (!loading) {
            navigate('/app/accounts/add-account', {
                state: {
                    detail: false,
                    status: status || [], users: users || [], countries: countries || [], leads: leads || []
                }
            })
        }
    }
    const deleteRow = (id: any) => {
        setSelectedId(id)
        setDeleteRowModal(!deleteRowModal)
    }


    const deleteRowModalClose = () => {
        setDeleteRowModal(false)
        setSelectedId([])
    }
    const deleteItem = () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        fetchData(`${AccountsUrl}/${selectedId}/`, 'DELETE', null as any, Header)
            .then((res: any) => {
                console.log('delete:', res);
                if (!res.error) {
                    deleteRowModalClose()
                    getAccounts()
                }
            })
            .catch(() => {
            })
    }

    const modalDialog = 'Are You Sure You want to delete this Account?'
    const modalTitle = 'Delete Account'

    const recordsList = [[10, '10 Records per page'], [20, '20 Records per page'], [30, '30 Records per page'], [40, '40 Records per page'], [50, '50 Records per page']]


    return (
        <Box sx={{ mt: '60px' }}>
            <CustomToolbar>
                <Tabs value={false} defaultValue={tab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
                    <CustomTab value="open" label="Open"
                        sx={{
                            backgroundColor: tab === 'open' ? '#F0F7FF' : '#284871',
                            color: tab === 'open' ? '#3f51b5' : 'white',
                        }} />
                    <CustomTab value="closed" label="Closed"
                        sx={{
                            backgroundColor: tab === 'closed' ? '#F0F7FF' : '#284871',
                            color: tab === 'closed' ? '#3f51b5' : 'white',
                            ml: '5px',
                        }}
                    />
                </Tabs>

                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Select
                        value={tab === 'open' ? openRecordsPerPage : closedRecordsPerPage}
                        onChange={(e: any) => handleRecordsPerPage(e)}
                        open={selectOpen}
                        onOpen={() => setSelectOpen(true)}
                        onClose={() => setSelectOpen(false)}
                        className={`custom-select`}
                        onClick={() => setSelectOpen(!selectOpen)}
                        IconComponent={() => (
                            <div onClick={() => setSelectOpen(!selectOpen)} className="custom-select-icon">
                                {selectOpen ? <FiChevronUp style={{ marginTop: '12px' }} /> : <FiChevronDown style={{ marginTop: '12px' }} />}
                            </div>
                        )}
                        sx={{
                            '& .MuiSelect-select': { overflow: 'visible !important' }
                        }}
                    >
                        {recordsList?.length && recordsList.map((item: any, i: any) => (
                            <MenuItem key={i} value={item[0]}>
                                {item[1]}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ borderRadius: '7px', backgroundColor: 'white', height: '40px', minHeight: '40px', maxHeight: '40px', display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 1, p: '0px' }}>
                        <FabLeft onClick={handlePreviousPage} disabled={tab === 'open' ? openCurrentPage === 1 : closedCurrentPage === 1}>
                            <FiChevronLeft style={{ height: '15px' }} />
                        </FabLeft>
                        <Typography sx={{ mt: 0, textTransform: 'lowercase', fontSize: '15px', color: '#1A3353', textAlign: 'center' }}>
                            {tab === 'open' ? `${openCurrentPage} to ${openTotalPages}` : `${closedCurrentPage} to ${closedTotalPages}`}

                        </Typography>
                        <FabRight onClick={handleNextPage} disabled={tab === 'open' ? (openCurrentPage === openTotalPages) : (closedCurrentPage === closedTotalPages)}>
                            <FiChevronRight style={{ height: '15px' }} />
                        </FabRight>
                    </Box>
                    <Button
                        variant='contained'
                        startIcon={<FiPlus className='plus-icon' />}
                        onClick={onAddAccount}
                        className={'add-button'}
                    >
                        Add Account
                    </Button>
                </Stack>
            </CustomToolbar>
            <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
                <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
                    <Paper sx={{ width: 'cal(100%-15px)', mb: 2, p: '0px 15px 15px 15px' }}>
                        <TableContainer>
                            <Table>
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={tab === 'open' ? openAccounts?.length : closedAccounts?.length}
                                    numSelectedId={selectedId}
                                    isSelectedId={isSelectedId}
                                    headCells={headCells}
                                />
                                {tab === 'open' ?
                                    <TableBody>
                                        {
                                            openAccounts?.length > 0
                                                ? stableSort(openAccounts, getComparator(order, orderBy))
                                                    .map((item: any, index: any) => {
                                                        return (
                                                            <TableRow
                                                                tabIndex={-1}
                                                                key={index}
                                                                sx={{ border: 0, '&:nth-of-type(even)': { backgroundColor: 'whitesmoke' }, color: 'rgb(26, 51, 83)' }}
                                                            >
                                                                <TableCell
                                                                    className='tableCell-link'
                                                                    onClick={() => accountDetail(item.id)}
                                                                >
                                                                    {item?.name ? item?.name : '---'}
                                                                </TableCell>
                                                                <TableCell className='tableCell'>
                                                                    {item?.website ? item?.website : '---'}
                                                                </TableCell>
                                                                <TableCell className='tableCell'>
                                                                    <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                                                        <Avatar src={item?.lead?.created_by?.profile_pic} alt={item?.lead?.created_by?.email} /><Stack sx={{ ml: 1 }}>{item?.lead?.account_name ? item?.lead?.account_name : '---'}</Stack>
                                                                    </Stack>
                                                                </TableCell>
                                                                <TableCell className='tableCell'>
                                                                    {item?.lead?.country ? item?.lead?.country : '---'}
                                                                </TableCell>
                                                                <TableCell className='tableCell'>
                                                                    <IconButton>
                                                                        <FaTrashAlt
                                                                            onClick={() => deleteRow(item?.id)}
                                                                            style={{ fill: '#1A3353', cursor: 'pointer', width: '15px' }} />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                : <TableRow> <TableCell colSpan={6} sx={{ border: 0 }}><Spinner /></TableCell></TableRow>
                                        }
                                    </TableBody> :
                                    <TableBody>
                                        {
                                            closedAccounts?.length > 0
                                                ? stableSort(closedAccounts, getComparator(order, orderBy)).map((item: any, index: any) => {
                                                    return (
                                                        <TableRow
                                                            tabIndex={-1}
                                                            key={index}
                                                            sx={{ border: 0, '&:nth-of-type(even)': { backgroundColor: 'whitesmoke' }, color: 'rgb(26, 51, 83)', textTransform: 'capitalize' }}
                                                        >
                                                            <TableCell
                                                                className='tableCell-link'
                                                                onClick={() => accountDetail(item.id)}
                                                            >
                                                                {item?.name ? item?.name : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {item?.website ? item?.website : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                                                    <Avatar src={item?.lead?.created_by?.profile_pic} alt={item?.lead?.created_by?.email} /><Stack sx={{ ml: 1 }}>{item?.lead?.account_name ? item?.lead?.account_name : '---'}</Stack>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {item?.lead?.country ? item?.lead?.country : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                <IconButton>
                                                                    <FaTrashAlt
                                                                        onClick={() => deleteRow(item?.id)}
                                                                        style={{ fill: '#1A3353', cursor: 'pointer', width: '15px' }} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                : <TableRow> <TableCell colSpan={6} sx={{ border: 0 }}><Spinner /></TableCell></TableRow>
                                        }
                                    </TableBody>
                                }

                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Container>
            <DeleteModal
                onClose={deleteRowModalClose}
                open={deleteRowModal}
                id={selectedId}
                modalDialog={modalDialog}
                modalTitle={modalTitle}
                DeleteItem={deleteItem}
            />
        </Box>
    )
}
