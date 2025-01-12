import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    TextField,
    Grid,
    Button,
    MenuItem,
    Box,
    Typography,
    Tab,
    FormControlLabel,
    InputLabel,
    FormControl,
    Switch,
    Card,
    Select
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import branchServices from 'services/branchServices';
import fileService from 'services/fileService';
import { ServiceFactory } from 'services/index';

const AddEditBranch = () => {
    const brandService = ServiceFactory.get('brands');
    const [tabValue, setTabValue] = useState('1');
    const [brands, setBrands] = useState([]);
    const [p1, setP1] = useState(null);
    const { id } = useParams();
    const [branch, setBranch] = useState();

    const navigate = useNavigate();
    const getBranch = async () => {
        try {
            const res = await branchServices.getBranchById(id);
            const branch = res?.data?.result;
            if (branch) {
                setInitialValues((prev) => ({
                    ...prev,
                    ...branch,
                    DeliveryDistanceKM: branch?.deliveryDistanceKM,
                    DeliveryFee: branch?.deliveryFee,
                    usedDeliverySystem: branch?.usedDeliverySystem // Patch the values dynamically
                }));
            }
        } catch (err) {
            console.error(err.response);
        }
    };
    const getBrands = async () => {
        await brandService
            .getAllBrands()
            .then((res) => {
                setBrands(res.data.result || []);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        getBrands();
        if (id) {
            getBranch();
        }
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const [initialValues, setInitialValues] = useState({
        name: '',
        nativeName: '',
        brandId: '',
        branchPhoneNumber: '',
        acceptTime: '',
        readyTime: '',
        branchAddress: '',
        nativeBranchAddress: '',
        logoUrl: '',
        openTime: '',
        closeTime: '',
        isDelivery: false,
        isPickup: false,
        isCarService: false,
        deliveryDistance: '',
        deliveryFee: '',
        DeliveryDistanceKM: 0,
        DeliveryFee: 0,
        UsedDeliverySystem: 1,
        branchTimingsString: '',
        branchTimingsStringNative: ''
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Store Name is required'),
        nativeName: Yup.string().required('Store Name (Native) is required'),
        brandId: Yup.string().required('Brand is required'),
        branchPhoneNumber: Yup.number().required('Phone Number is required'),
        acceptTime: Yup.number().required('Accept Time is required'),
        readyTime: Yup.number().required('Ready Time is required'),
        branchAddress: Yup.string().required('Address is required'),
        nativeBranchAddress: Yup.string().required('Native Address is required'),
        openTime: Yup.string().required('Opening Time is required'),
        closeTime: Yup.string().required('Closing Time is required'),
        DeliveryDistanceKM: Yup.number().when('enableDelivery', {
            is: true,
            then: Yup.number().required('Delivery Distance is required')
        }),
        deliveryFee: Yup.number().when('enableDelivery', {
            is: true,
            then: Yup.number().required('Delivery Fee is required')
        }),
        UsedDeliverySystem: Yup.number().when('enableDelivery', {
            is: true,
            then: Yup.number().required('Select Delivery System')
        }),
        latitude: branch?.latitude || '',
        longitude: branch?.longitude || '',
        arrivalArea: branch?.arrivalArea || 0
    });

    const handleSubmit = async (values) => {
        let payload = { ...values };
        if (p1) {
            try {
                const logoResponse = await fileService.uploadBranchLogo(p1);
                payload.logoUrl = logoResponse.data?.result;
            } catch (err) {
                console.error(err);
            }
        }

        try {
            if (id) {
                await branchServices.editBranch(payload);
                console.log('Branch updated successfully');
            } else {
                await branchServices.createBranch(payload);
                console.log('Branch created successfully');
            }
            navigate('/branches');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" mb={3}>
                    {id ? 'Edit Store' : 'Create New Store'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ padding: 4, margin: '3px 0' }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, errors, touched, setFieldValue }) => {
                            return (
                                <Form>
                                    <TabContext value={tabValue}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                            <TabList onChange={handleTabChange}>
                                                <Tab label="Basic Info" value="1" />
                                                <Tab label="Timings" value="2" />
                                                <Tab label="Settings" value="3" />
                                                <Tab label="Address" value="4" />
                                                <Tab label="Logo" value="5" />
                                            </TabList>
                                        </Box>

                                        {/* Tab 1: Basic Info */}
                                        <TabPanel value="1">
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Store Name"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="name"
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        error={touched.name && Boolean(errors.name)}
                                                        helperText={touched.name && errors.name}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Store Name (Native)"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="nativeName"
                                                        value={values.nativeName}
                                                        onChange={handleChange}
                                                        error={touched.nativeName && Boolean(errors.nativeName)}
                                                        helperText={touched.nativeName && errors.nativeName}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        select
                                                        label="Select Brand"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="brandId"
                                                        value={values.brandId}
                                                        onChange={handleChange}
                                                        error={touched.brandId && Boolean(errors.brandId)}
                                                        helperText={touched.brandId && errors.brandId}
                                                    >
                                                        {brands.map((brand) => (
                                                            <MenuItem key={brand.id} value={brand.id}>
                                                                {brand.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Phone Number"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchPhoneNumber"
                                                        value={values.branchPhoneNumber}
                                                        onChange={handleChange}
                                                        error={touched.branchPhoneNumber && Boolean(errors.branchPhoneNumber)}
                                                        helperText={touched.branchPhoneNumber && errors.branchPhoneNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Avg Order Accept Time In Minutes"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="acceptTime"
                                                        value={values.acceptTime}
                                                        onChange={handleChange}
                                                        error={touched.acceptTime && Boolean(errors.acceptTime)}
                                                        helperText={touched.acceptTime && errors.acceptTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Avg Order Ready Time In Minutes"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="readyTime"
                                                        value={values.readyTime}
                                                        onChange={handleChange}
                                                        error={touched.readyTime && Boolean(errors.readyTime)}
                                                        helperText={touched.readyTime && errors.readyTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => setTabValue('2')}
                                                        disabled={
                                                            !values.name ||
                                                            !values.nativeName ||
                                                            !values.brandId ||
                                                            !values.branchPhoneNumber
                                                        }
                                                    >
                                                        Next
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 2: Timings */}
                                        <TabPanel value="2">
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Opening Time"
                                                        fullWidth
                                                        type="time"
                                                        variant="outlined"
                                                        name="openTime"
                                                        value={values.openTime}
                                                        onChange={handleChange}
                                                        error={touched.openTime && Boolean(errors.openTime)}
                                                        helperText={touched.openTime && errors.openTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Closing Time"
                                                        fullWidth
                                                        type="time"
                                                        variant="outlined"
                                                        name="closeTime"
                                                        value={values.closeTime}
                                                        onChange={handleChange}
                                                        error={touched.closeTime && Boolean(errors.closeTime)}
                                                        helperText={touched.closeTime && errors.closeTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Working hours Text"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchTimingsString"
                                                        value={values.branchTimingsString}
                                                        onChange={handleChange}
                                                        error={touched.branchTimingsString && Boolean(errors.branchTimingsString)}
                                                        helperText={touched.branchTimingsString && errors.branchTimingsString}
                                                    />
                                                </Grid>

                                                {/* Branch Timings String Native */}
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Working Hours Text (Native)"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchTimingsStringNative"
                                                        value={values.branchTimingsStringNative}
                                                        onChange={handleChange}
                                                        error={
                                                            touched.branchTimingsStringNative && Boolean(errors.branchTimingsStringNative)
                                                        }
                                                        helperText={touched.branchTimingsStringNative && errors.branchTimingsStringNative}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button variant="contained" onClick={() => setTabValue('3')}>
                                                        Next
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 3: Settings */}
                                        <TabPanel value="3">
                                            <Grid container spacing={3}>
                                                {/* Enable Pickup */}
                                                <Grid item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="isPickup"
                                                                checked={values.isPickup}
                                                                onChange={(e) => setFieldValue('isPickup', e.target.checked)}
                                                            />
                                                        }
                                                        label="Enable Pickup"
                                                    />
                                                </Grid>

                                                {/* Enable Car Service */}
                                                <Grid item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="isCarService"
                                                                checked={values.isCarService}
                                                                onChange={(e) => setFieldValue('isCarService', e.target.checked)}
                                                            />
                                                        }
                                                        label="Enable Car Service"
                                                    />
                                                </Grid>

                                                {/* Enable Delivery */}
                                                <Grid item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="isDelivery"
                                                                checked={values.isDelivery}
                                                                onChange={(e) => setFieldValue('isDelivery', e.target.checked)}
                                                            />
                                                        }
                                                        label="Enable Delivery"
                                                    />
                                                </Grid>

                                                {values.isDelivery && (
                                                    <>
                                                        {/* Delivery Distance KM */}
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Delivery Distance (KM)"
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                name="DeliveryDistanceKM"
                                                                value={values.DeliveryDistanceKM}
                                                                onChange={handleChange}
                                                                error={touched.DeliveryDistanceKM && Boolean(errors.DeliveryDistanceKM)}
                                                                helperText={touched.DeliveryDistanceKM && errors.DeliveryDistanceKM}
                                                            />
                                                        </Grid>

                                                        {/* Delivery Fee */}
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Delivery Fee"
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                name="DeliveryFee"
                                                                value={values.DeliveryFee}
                                                                onChange={handleChange}
                                                                error={touched.DeliveryFee && Boolean(errors.DeliveryFee)}
                                                                helperText={touched.DeliveryFee && errors.DeliveryFee}
                                                            />
                                                        </Grid>

                                                        {/* Used Delivery System */}
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="used-delivery-system-label">
                                                                    Used Delivery System
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="used-delivery-system-label"
                                                                    id="used-delivery-system-select"
                                                                    value={values.UsedDeliverySystem}
                                                                    onChange={(e) => setFieldValue('UsedDeliverySystem', e.target.value)}
                                                                >
                                                                    <MenuItem value={1}>Verdi</MenuItem>
                                                                    {/* Add more options as needed */}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                )}

                                                <Grid item xs={12}>
                                                    <Button variant="contained" onClick={() => setTabValue('4')}>
                                                        Next
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 4: Address */}
                                        <TabPanel value="4">
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Address"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchAddress"
                                                        value={values.branchAddress}
                                                        onChange={handleChange}
                                                        error={touched.branchAddress && Boolean(errors.branchAddress)}
                                                        helperText={touched.branchAddress && errors.branchAddress}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Native Address"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="nativeBranchAddress"
                                                        value={values.nativeBranchAddress}
                                                        onChange={handleChange}
                                                        error={touched.nativeBranchAddress && Boolean(errors.nativeBranchAddress)}
                                                        helperText={touched.nativeBranchAddress && errors.nativeBranchAddress}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Latitude"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="latitude"
                                                        value={values.latitude}
                                                        onChange={handleChange}
                                                        error={touched.latitude && Boolean(errors.latitude)}
                                                        helperText={touched.latitude && errors.latitude}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Longitude"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="longitude"
                                                        value={values.longitude}
                                                        onChange={handleChange}
                                                        error={touched.longitude && Boolean(errors.longitude)}
                                                        helperText={touched.longitude && errors.longitude}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Arrival Area (Meters)"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="arrivalArea"
                                                        value={values.arrivalArea}
                                                        onChange={handleChange}
                                                        error={touched.arrivalArea && Boolean(errors.arrivalArea)}
                                                        helperText={touched.arrivalArea && errors.arrivalArea}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button variant="contained" onClick={() => setTabValue('5')}>
                                                        Next
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 5: Logo */}
                                        <TabPanel value="5">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Typography>Upload Logo</Typography>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: 200,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: '#f0f0f0',
                                                            border: '1px dashed #ccc'
                                                        }}
                                                    >
                                                        {values.logoUrl && (
                                                            <img
                                                                src={values.logoUrl}
                                                                alt="Logo"
                                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                            />
                                                        )}
                                                        <input
                                                            type="file"
                                                            onChange={(e) => setP1(e.target.files[0])}
                                                            style={{ marginTop: 16 }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button variant="contained" type="submit">
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                    </TabContext>
                                </Form>
                            );
                        }}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AddEditBranch;
