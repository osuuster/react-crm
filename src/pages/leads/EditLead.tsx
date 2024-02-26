import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    TextField,
    FormControl,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Typography,
    Box,
    MenuItem,
    Chip,
    Autocomplete,
    FormHelperText,
    Tooltip,
    Divider,
    Select,
    Button
} from '@mui/material'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { LeadUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaCheckCircle, FaPlus, FaTimes, FaTimesCircle } from 'react-icons/fa'
import { CustomPopupIcon, RequiredTextField, } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import '../../styles/style.css'



type FormErrors = {
    title?: string[],
    first_name?: string[],
    last_name?: string[],
    account_name?: string[],
    phone?: string[],
    email?: string[],
    lead_attachment?: string[],
    opportunity_amount?: string[],
    website?: string[],
    description?: string[],
    teams?: string[],
    assigned_to?: string[],
    contacts?: string[],
    status?: string[],
    source?: string[],
    address_line?: string[],
    street?: string[],
    city?: string[],
    state?: string[],
    postcode?: string[],
    country?: string[],
    tags?: string[],
    company?: string[],
    probability?: number[],
    industry?: string[],
    skype_ID?: string[],
    file?: string[],
};
interface FormData {
    title: string,
    first_name: string,
    last_name: string,
    account_name: string,
    phone: string,
    email: string,
    lead_attachment: string | null,
    opportunity_amount: string,
    website: string,
    description: string,
    teams: string,
    assigned_to: string[],
    contacts: string[],
    status: string,
    source: string,
    address_line: string,
    street: string,
    city: string,
    state: string,
    postcode: string,
    country: string,
    tags: string[],
    company: string,
    probability: number,
    industry: string,
    skype_ID: string,
    file: string | null
}

export function EditLead() {
    const navigate = useNavigate()
    const location = useLocation();
    const { state } = location;
    const { quill, quillRef } = useQuill();
    const initialContentRef = useRef<string | null>(null);
    const pageContainerRef = useRef<HTMLDivElement | null>(null);

    const [hasInitialFocus, setHasInitialFocus] = useState(false);

    const autocompleteRef = useRef<any>(null);
    const [reset, setReset] = useState(false)
    const [error, setError] = useState(false)
    const [selectedContacts, setSelectedContacts] = useState<any[]>([] || '');
    const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([] || '');
    const [statusSelectOpen, setStatusSelectOpen] = useState(false)
    const [countrySelectOpen, setCountrySelectOpen] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        title: '',
        first_name: '',
        last_name: '',
        account_name: '',
        phone: '',
        email: '',
        lead_attachment: null,
        opportunity_amount: '',
        website: '',
        description: '',
        teams: '',
        assigned_to: [],
        contacts: [],
        status: 'assigned',
        source: 'call',
        address_line: '',
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        tags: [],
        company: '',
        probability: 1,
        industry: 'ADVERTISING',
        skype_ID: '',
        file: null
    })

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
        // Set focus to the page container after the Quill editor loads its content
        if (quill && !hasInitialFocus) {
            quill.on('editor-change', () => {
                if (pageContainerRef.current) {
                    pageContainerRef.current.focus();
                    setHasInitialFocus(true); // Set the flag to true after the initial focus
                }
            });
        }
        // Cleanup: Remove event listener when the component unmounts
        return () => {
            if (quill) {
                quill.off('editor-change');
            }
        };
    }, [quill, hasInitialFocus]);

    useEffect(() => {
        setFormData(state?.value)
    }, [state?.id])

    useEffect(() => {
        if (reset) {
            setFormData(state?.value)
            if (quill && initialContentRef.current !== null) {
                quill.clipboard.dangerouslyPasteHTML(initialContentRef.current);
            }
        }
        return () => {
            setReset(false)
        }
    }, [reset, quill, state?.value])

    useEffect(() => {
        if (quill && initialContentRef.current === null) {
            // Save the initial state (HTML content) of the Quill editor only if not already saved
            initialContentRef.current = formData.description;
            quill.clipboard.dangerouslyPasteHTML(formData.description);
        }
    }, [quill, formData.description]);

    const handleChange2 = (title: any, val: any) => {
        // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // console.log('nd', val)
        if (title === 'contacts') {
            setFormData({ ...formData, contacts: val.length > 0 ? val.map((item: any) => item.id) : [] });
            setSelectedContacts(val);
        } else if (title === 'assigned_to') {
            setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
            setSelectedAssignTo(val);
        }
        // else if (title === 'country') {
        //   setFormData({ ...formData, country: val || [] })
        //   setSelectedCountry(val);
        // }
        else {
            setFormData({ ...formData, [title]: val })
        }
    }
    const handleChange = (e: any) => {
        const { name, value, files, type, checked, id } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files?.[0] || null });
        }
        else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const resetQuillToInitialState = () => {
        setFormData({ ...formData, description: '' })
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML('');
        }
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        submitForm();
    }
    const submitForm = () => {
        const data = {
            title: formData.title,
            first_name: formData.first_name,
            last_name: formData.last_name,
            account_name: formData.account_name,
            phone: formData.phone,
            email: formData.email,
            lead_attachment: formData.file || [],
            opportunity_amount: formData.opportunity_amount,
            website: formData.website,
            description: formData.description,
            teams: formData.teams,
            assigned_to: formData.assigned_to,
            contacts: formData.contacts,
            status: formData.status,
            source: formData.source,
            address_line: formData.address_line,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country,
            tags: formData.tags || [],
            company: formData.company || '',
            probability: formData.probability,
            industry: formData.industry,
        }
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        fetchData(`${LeadUrl}/${state?.id}/`, 'PUT', JSON.stringify(data), Header)
            .then((res: any) => {
                if (!res.error) {
                    backbtnHandle()
                }
                if (res.error) {
                    setError(true)
                    setErrors(res?.errors)
                }
            })
            .catch(() => {
            })
    };

    const onCancel = () => {
        setReset(true)
        if (quill && initialContentRef.current !== null) {
            quill.clipboard.dangerouslyPasteHTML(initialContentRef.current);
        }
    }

    const backbtnHandle = () => {
        navigate('/app/leads/lead-details', { state: { leadId: state?.id, detail: true } })
    }

    const module = 'Leads'
    const crntPage = 'Edit Lead'
    const backBtn = 'Back To Lead Details'

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
            <Box sx={{ mt: "120px" }} >
                <div onSubmit={handleSubmit}>
                    <div style={{ padding: '10px' }}>
                        <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }} >
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Lead Information</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Lead Name</div>
                                                <TextField
                                                    ref={pageContainerRef} tabIndex={-1}
                                                    autoFocus
                                                    name='account_name'
                                                    value={formData.account_name || ''}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.account_name?.[0] ? errors?.account_name[0] : ''}
                                                    error={!!errors?.account_name?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Amount</div>
                                                <TextField
                                                    type={'number'}
                                                    name='opportunity_amount'
                                                    value={formData.opportunity_amount || ''}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.opportunity_amount?.[0] ? errors?.opportunity_amount[0] : ''}
                                                    error={!!errors?.opportunity_amount?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Website</div>
                                                <TextField
                                                    name='website'
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.website?.[0] ? errors?.website[0] : ''}
                                                    error={!!errors?.website?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Status</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='status'
                                                        value={formData.status}
                                                        open={statusSelectOpen}
                                                        onClick={() => setStatusSelectOpen(!statusSelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setStatusSelectOpen(!statusSelectOpen)} className="select-icon-background">
                                                                {statusSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className={'select'}
                                                        onChange={handleChange}
                                                        error={!!errors?.status?.[0]}
                                                    >
                                                        {state?.status?.length && state?.status.map((option: any) => (
                                                            <MenuItem key={option[0]} value={option[1]}>
                                                                {option[1]}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors?.status?.[0] ? errors?.status[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Assign To</div>
                                                <FormControl error={!!errors?.assigned_to?.[0]} sx={{ width: '70%' }}>
                                                    <Autocomplete
                                                        // ref={autocompleteRef}
                                                        multiple
                                                        value={selectedAssignTo}
                                                        // name='contacts'
                                                        limitTags={2}
                                                        options={state?.users || []}
                                                        // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                                                        getOptionLabel={(option: any) => state?.users ? option?.user_details?.email : option}
                                                        // getOptionLabel={(option: any) => option?.user__email}
                                                        onChange={(e: any, value: any) => handleChange2('assigned_to', value)}
                                                        size='small'
                                                        filterSelectedOptions
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip
                                                                    deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                                                    sx={{
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                        height: '18px'

                                                                    }}
                                                                    variant='outlined'
                                                                    label={state?.users ? option?.user_details?.email : option}
                                                                    {...getTagProps({ index })}
                                                                />
                                                            ))
                                                        }
                                                        popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                                                        renderInput={(params) => (
                                                            <TextField {...params}
                                                                placeholder='Add Users'
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    sx: {
                                                                        '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                                                        '& .MuiAutocomplete-endAdornment': {
                                                                            mt: '-8px',
                                                                            mr: '-8px',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <FormHelperText>{errors?.assigned_to?.[0] || ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                            <div className='fieldSubContainer'>

                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>

                                            </div>
                                            <div className='fieldSubContainer'>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* contact details */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Contact</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>First Name</div>
                                                <RequiredTextField
                                                    name='first_name'
                                                    required
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.first_name?.[0] ? errors?.first_name[0] : ''}
                                                    error={!!errors?.first_name?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Last Name</div>
                                                <RequiredTextField
                                                    name='last_name'
                                                    required
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.last_name?.[0] ? errors?.last_name[0] : ''}
                                                    error={!!errors?.last_name?.[0]}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Email Address</div>
                                                <TextField
                                                    name='email'
                                                    type='email'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.email?.[0] ? errors?.email[0] : ''}
                                                    error={!!errors?.email?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Phone Number</div>
                                                <Tooltip title="Number must starts with +91">
                                                    <TextField
                                                        name='phone'
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        style={{ width: '70%' }}
                                                        size='small'
                                                        helperText={errors?.phone?.[0] ? errors?.phone[0] : ''}
                                                        error={!!errors?.phone?.[0]}
                                                    />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* address details */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Address</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'
                                                >Address Lane</div>
                                                <TextField
                                                    name='address_line'
                                                    value={formData.address_line}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.address_line?.[0] ? errors?.address_line[0] : ''}
                                                    error={!!errors?.address_line?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>City</div>
                                                <TextField
                                                    name='city'
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.city?.[0] ? errors?.city[0] : ''}
                                                    error={!!errors?.city?.[0]}
                                                />
                                            </div>
                                        </div>

                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Postal code</div>
                                                <TextField
                                                    name='postcode'
                                                    value={formData.postcode}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    helperText={errors?.postcode?.[0] ? errors?.postcode[0] : ''}
                                                    error={!!errors?.postcode?.[0]}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Country</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='country'
                                                        value={formData.country}
                                                        open={countrySelectOpen}
                                                        onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setCountrySelectOpen(!countrySelectOpen)} className="select-icon-background">
                                                                {countrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    height: '200px'
                                                                }
                                                            }
                                                        }}
                                                        className={'select'}
                                                        onChange={handleChange}
                                                        error={!!errors?.country?.[0]}
                                                    >
                                                        {state?.countries?.length && state?.countries.map((option: any) => (
                                                            <MenuItem key={option[0]} value={option[0]}>
                                                                {option[1]}
                                                            </MenuItem>
                                                        ))}

                                                    </Select>
                                                    <FormHelperText>{errors?.country?.[0] ? errors?.country[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* Description details  */}
                        <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Description</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '100%', mb: 1 }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='DescriptionDetail'>
                                            <div className='descriptionTitle'>Description</div>
                                            <div style={{ width: '100%', marginBottom: '3%' }} >
                                                <div ref={quillRef} />
                                            </div>
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 1.5 }}>
                                            <Button
                                                className='header-button'
                                                onClick={resetQuillToInitialState}
                                                size='small'
                                                variant='contained'
                                                startIcon={<FaTimesCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                                                sx={{ backgroundColor: '#2b5075', ':hover': { backgroundColor: '#1e3750' } }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className='header-button'
                                                onClick={() => setFormData({ ...formData, description: quillRef.current.firstChild.innerHTML })}
                                                variant='contained'
                                                size='small'
                                                startIcon={<FaCheckCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                                                sx={{ ml: 1 }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </Box>
        </Box >
    )
}
