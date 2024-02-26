import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Avatar,
    Box,
    Snackbar,
    Alert,
    Stack,
} from '@mui/material'

import { fetchData } from '../../components/FetchData'
import { AccountsUrl } from '../../services/ApiUrls'
import { CustomAppBar } from '../../components/CustomAppBar'
import FormateTime from '../../components/FormateTime'


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
    org: { name: string };
    lead: { account_name: string };
    account_attachment: [];
    assigned_to: [];
    billing_address_line: string;
    billing_city: string;
    billing_country: string;
    billing_state: string;
    billing_postcode: string;
    billing_street: string;
    contact_name: string;
    name: string;

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
    description: string;
    status: string;
    source: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    tags: [];
    company: string;
    probability: string;
    industry: string;
    skype_ID: string;
    file: string;

    close_date: string;
    organization: string;
    created_from_site: boolean;
    id: string;
    teams: [];
    leads: string;

};
export const AccountDetails = (props: any) => {
    const { state } = useLocation()
    const navigate = useNavigate()

    const [accountDetails, setAccountDetails] = useState<response | null>(null)
    const [usersDetails, setUsersDetails] = useState<Array<{
        user_details: {
            email: string;
            id: string;
            profile_pic: string;
        }
    }>>([]);
    const [countries, setCountries] = useState<string[][]>([])
    const [status, setStatus] = useState([])
    const [users, setUsers] = useState([])
    const [leads, setLeads] = useState([])

    useEffect(() => {
        getAccountDetails(state.accountId)
    }, [state.accountId])

    const getAccountDetails = (id: any) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        fetchData(`${AccountsUrl}/${id}/`, 'GET', null as any, Header)
            .then((res) => {
                if (!res.error) {
                    setAccountDetails(res?.account_obj)
                    setUsers(res?.users)
                    setStatus(res?.status)
                    setCountries(res?.countries)
                    setLeads(res?.leads)
                }
            })
            .catch((err) => {
                // console.error('Error:', err)
                < Snackbar open={err} autoHideDuration={4000} onClose={() => navigate('/app/accounts')} >
                    <Alert onClose={() => navigate('/app/accounts')} severity="error" sx={{ width: '100%' }}>
                        Failed to load!
                    </Alert>
                </Snackbar >
            })
    }
    const accountCountry = (country: string) => {
        let countryName: string[] | undefined;
        for (countryName of countries) {
            if (Array.isArray(countryName) && countryName.includes(country)) {
                const ele = countryName;
                break;
            }
        }
        return countryName?.[1]
    }
    const editHandle = () => {
        let country: string[] | undefined;
        for (country of countries) {
            if (Array.isArray(country) && country.includes(accountDetails?.country || '')) {
                const firstElement = country[0];
                break;
            }
        }
        navigate('/app/accounts/edit-account', {
            state: {
                value: {
                    name: accountDetails?.name,
                    phone: accountDetails?.phone,
                    email: accountDetails?.email,
                    billing_address_line: accountDetails?.billing_address_line,
                    billing_street: accountDetails?.billing_street,
                    billing_city: accountDetails?.billing_city,
                    billing_state: accountDetails?.billing_state,
                    billing_postcode: accountDetails?.billing_postcode,
                    billing_country: accountDetails?.billing_country,
                    contact_name: accountDetails?.contact_name,
                    teams: accountDetails?.teams || [],
                    assigned_to: accountDetails?.assigned_to || [],
                    tags: accountDetails?.tags || [],
                    account_attachment: accountDetails?.account_attachment || null,
                    website: accountDetails?.website,
                    status: accountDetails?.status,
                    lead: accountDetails?.lead?.account_name,
                }, id: state?.accountId,
                status: state?.status || [], users: state?.users || [], countries: state?.countries || [], leads: state?.leads || []
            }
        }
        )
    }

    const backbtnHandle = () => {
        navigate('/app/accounts')
    }

    const module = 'Accounts'
    const crntPage = 'Account Details'
    const backBtn = 'Back To Accounts'

    return (
        <Box sx={{ mt: '60px' }}>

            <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} editHandle={editHandle} />
            <Box sx={{ mt: '110px', p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ width: '65%' }}>
                    <Box sx={{ borderRadius: '10px', border: '1px solid #80808038', backgroundColor: 'white' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                Account Information
                            </div>
                            <div style={{ color: 'gray', fontSize: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: '15px' }}>
                                    created &nbsp;
                                    {FormateTime(accountDetails?.created_at)} &nbsp; by   &nbsp;
                                    <Avatar
                                        // src={accountDetails?.created_by?.profile_pic}
                                        alt={accountDetails?.created_by?.email}
                                    />
                                    &nbsp;&nbsp;
                                    {accountDetails?.created_by?.email}
                                    {/* {accountDetails?.first_name}&nbsp;
                                        {accountDetails?.last_name} */}
                                </div>

                            </div>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
                            <div className='title2'>
                                {accountDetails?.name}
                                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                                    {/* {
                                            lead.assigned_to && lead.assigned_to.map((assignItem) => (
                                                assignItem.user_details.profile_pic
                                                    ? */}
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
                            <div style={{ width: '32%' }}>
                                <div className='title2'>Website</div>
                                <div className='title3'>
                                    {accountDetails?.website || '----'}
                                </div>
                            </div>
                            <div style={{ width: '32%' }}>
                                <div className='title2'>Contact Name</div>
                                <div className='title3'>
                                    {accountDetails?.contact_name}
                                </div>
                            </div>
                            <div style={{ width: '32%' }}>
                                <div className='title2'>Organization Name</div>
                                <div className='title3'>
                                    {accountDetails?.org?.name || '----'}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '20px', marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ width: '32%' }}>
                                <div className='title2'>Leads</div>
                                <div className='title3'>
                                    {accountDetails?.lead?.account_name || '----'}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '20px', marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ width: '32%' }}>
                                <div className='title2'>Email Address</div>
                                <div className='title3'>
                                    {accountDetails?.email || '----'}
                                </div>
                            </div>
                            <div style={{ width: '32%' }}>
                                <div className='title2'>Mobile Number</div>
                                <div className='title3'>
                                    {accountDetails?.phone || '----'}
                                </div>
                            </div>
                        </div>
                        {/* </div> */}
                        {/* Address details */}
                        <div style={{ marginTop: '2%' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                    Billing Details
                                </div>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Address</div>
                                    <div className='title3'>
                                        {accountDetails?.billing_address_line || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>City</div>
                                    <div className='title3'>
                                        {accountDetails?.billing_city || '----'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '20px', marginTop: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Postal code</div>
                                    <div className='title3'>
                                        {accountDetails?.billing_postcode || '----'}
                                    </div>
                                </div>
                                <div style={{ width: '32%' }}>
                                    <div className='title2'>Country</div>
                                    <div className='title3'>
                                        {accountCountry(accountDetails?.billing_country || '----')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Description */}
                        <div style={{ marginTop: '2%' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                                    Description
                                </div>
                            </div>
                            <Box sx={{ p: '15px' }}>
                                {accountDetails?.description ? <div dangerouslySetInnerHTML={{ __html: accountDetails?.description }} /> : '---'}
                            </Box>
                        </div>

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
