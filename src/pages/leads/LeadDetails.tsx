import React, { useEffect, useState } from 'react'
import {
    Link,
    Avatar,
    Box,
    Snackbar,
    Alert,
    Stack,
} from '@mui/material'
import { CustomAppBar } from '../../components/CustomAppBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { LeadUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'
import FormateTime from '../../components/FormateTime'
import '../../styles/style.css'

export const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

type response = {
    created_by: {
        email: string;
        id: string;
        profile_pic: string;
    };
    user_details: {
        email: string;
        id: string;
        profile_pic: string;
    };
    created_at: string;
    created_on: string;
    created_on_arrow: string;
    date_of_birth: string;
    title: string;
    first_name: string;
    last_name: string;
    account_name: string;
    phone: string;
    email: string;
    lead_attachment: string;
    opportunity_amount: string;
    website: string;
    description: string | '';
    teams: string;
    assigned_to: any;
    contacts: string;
    status: string;
    source: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    company: string;
    probability: string;
    industry: string;
    file: string;
    close_date: string;
    organization: string;
    created_from_site: boolean;
    id: string;
};
function LeadDetails(props: any) {
    const { state } = useLocation()
    const navigate = useNavigate();
    const [leadDetails, setLeadDetails] = useState<response | null>(null)
    const [usersDetails, setUsersDetails] = useState<Array<{
        user_details: {
            email: string;
            id: string;
            profile_pic: string;
        }
    }>>([]);
    const [countries, setCountries] = useState<string[][]>([])
    const [source, setSource] = useState([])
    const [status, setStatus] = useState([])
    const [contacts, setContacts] = useState([])
    const [users, setUsers] = useState([])
    const [teams, setTeams] = useState([])
    const [comments, setComments] = useState([])
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        getLeadDetails(state.leadId)
    }, [state.leadId])

    const getLeadDetails = (id: any) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        fetchData(`${LeadUrl}/${id}/`, 'GET', null as any, Header)
            .then((res) => {
                if (!res.error) {
                    setLeadDetails(res?.lead_obj)
                    setUsers(res?.users)
                    setCountries(res?.countries)
                    setStatus(res?.status)
                    setSource(res?.source)
                    setUsers(res?.users)
                    setContacts(res?.contacts)
                    setComments(res?.comments)
                }
            })
            .catch((err) => {
                < Snackbar open={err} autoHideDuration={4000} onClose={() => navigate('/app/leads')} >
                    <Alert onClose={() => navigate('/app/leads')} severity="error" sx={{ width: '100%' }}>
                        Failed to load!
                    </Alert>
                </Snackbar >
            })
    }

    const backbtnHandle = () => {
        navigate('/app/leads')
    }


    const editHandle = () => {
        let country: string[] | undefined;
        for (country of countries) {
            if (Array.isArray(country) && country.includes(leadDetails?.country || '')) {
                const firstElement = country[0];
                break;
            }
        }

        navigate('/app/leads/edit-lead', {
            state: {
                value: {
                    title: leadDetails?.title,
                    first_name: leadDetails?.first_name,
                    last_name: leadDetails?.last_name,
                    account_name: leadDetails?.account_name,
                    phone: leadDetails?.phone,
                    email: leadDetails?.email,
                    lead_attachment: leadDetails?.lead_attachment,
                    opportunity_amount: leadDetails?.opportunity_amount,
                    website: leadDetails?.website,
                    description: leadDetails?.description,
                    teams: leadDetails?.teams,
                    assigned_to: leadDetails?.assigned_to,
                    contacts: leadDetails?.contacts,
                    status: leadDetails?.status,
                    source: leadDetails?.source,
                    address_line: leadDetails?.address_line,
                    street: leadDetails?.street,
                    city: leadDetails?.city,
                    state: leadDetails?.state,
                    postcode: leadDetails?.postcode,
                    country: country?.[0],
                    company: leadDetails?.company,
                    probability: leadDetails?.probability,
                    industry: leadDetails?.industry,
                    file: leadDetails?.file,
                    close_date: leadDetails?.close_date,
                    organization: leadDetails?.organization,
                    created_from_site: leadDetails?.created_from_site,
                }, id: state?.leadId, countries, source, status, users, contacts, teams, comments
            }
        }
        )
    }


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const module = 'Leads'
    const crntPage = 'Lead Details'
    const backBtn = 'Back To Leads'
    return (
        <Box sx={{ mt: '60px' }}>
            <div>
                <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} editHandle={editHandle} />
                <Box sx={{ mt: '110px', p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderRadius: '10px', border: '1px solid #80808038', backgroundColor: 'white' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                    Lead Information
                                </div>
                                <div style={{ color: 'gray', fontSize: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: '15px' }}>
                                        created &nbsp;
                                        {FormateTime(leadDetails?.created_at)} &nbsp; by   &nbsp;
                                        <Avatar
                                            src={leadDetails?.created_by?.profile_pic}
                                            alt={leadDetails?.created_by?.email}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
                                <div className='title2'>
                                    {leadDetails?.title}
                                    <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                                        {usersDetails?.length ? usersDetails.map((val: any, i: any) =>
                                            <Avatar
                                                key={i}
                                                alt={val?.user_details?.email}
                                                src={val?.user_details?.profile_pic}
                                                sx={{ mr: 1 }}
                                            />
                                        ) : ''
                                        }
                                    </Stack>
                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ width: '50%' }}>
                                    <div className='title2'>Lead Name</div>
                                    <div className='title3'>
                                        {leadDetails?.account_name || '---'}
                                    </div>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <div className='title2'>Amount</div>
                                    <div className='title3'>
                                        {leadDetails?.opportunity_amount || '---'}
                                    </div>
                                </div>

                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ width: '50%' }}>
                                    <div className='title2'>Website</div>
                                    <div className='title3'>
                                        {leadDetails?.website ? <Link>
                                            {leadDetails?.website}
                                        </Link> : '---'}
                                    </div>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <div className='title2'>Status</div>
                                    <div className='title3'>
                                        {leadDetails?.status || '---'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2%' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                        Contact
                                    </div>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>First Name</div>
                                        <div className='title3'>
                                            {leadDetails?.first_name || '---'}
                                        </div>
                                    </div>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>Last Name</div>
                                        <div className='title3'>
                                            {leadDetails?.last_name || '---'}
                                        </div>
                                    </div>
                                </div>
                                <div className='detailList'>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>Email Address</div>
                                        <div className='title3'>
                                            {leadDetails?.email || '---'}
                                        </div>
                                    </div>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>Phone Number</div>
                                        <div className='title3'>
                                            {leadDetails?.phone || '---'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Address */}
                            <div style={{ marginTop: '2%' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                        Address
                                    </div>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>Address</div>
                                        <div className='title3'>
                                            {leadDetails?.address_line || '---'}
                                        </div>
                                    </div>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>City</div>
                                        <div className='title3'>
                                            {leadDetails?.city || '---'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>Postal code</div>
                                        <div className='title3'>
                                            {leadDetails?.postcode || '---'}
                                        </div>
                                    </div>
                                    <div style={{ width: '50%' }}>
                                        <div className='title2'>Country</div>
                                        <div className='title3'>
                                            {leadDetails?.country || '---'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Description */}
                            <div style={{ marginTop: '3%' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                        Description
                                    </div>
                                </div>
                                {/* <p style={{ fontSize: '16px', color: 'gray', padding: '15px' }}> */}
                                <Box sx={{ p: '15px' }}>
                                    {leadDetails?.description ? <div dangerouslySetInnerHTML={{ __html: leadDetails?.description }} /> : '---'}
                                </Box>
                                {/* </p> */}
                            </div>
                        </Box>
                    </Box>
                </Box>
            </div >
        </Box >
    )
}
export default LeadDetails;
