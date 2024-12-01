import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import OrderDetail from 'components/orders/OrderDetails';
import AnalyticBox from 'components/orders/analyticsBox';
import { OrdersTable } from 'features';
import { useBranches } from 'providers/branchesProvider';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import orderServices from 'services/orderServices';
import branchServices from 'services/branchServices';
import { update } from 'lodash';
import UpdateBranch from 'components/branches/updateBranch';

export default function Orders() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [reload, setReload] = useState(false);
    // const [timerReload, setTimerReload] = useState(false);
    const [analytics, setAnalytics] = useState({
        pending: 0,
        accepted: 0,
        closed: 0,
        rejected: 0,
        ready: 0
    });

    const [filter, setFilter] = useState('All');
    const [filterStatus, setFilterStatus] = useState(0);

    const [branchZero, setBranchZero] = useState([
        {
            id: 0,
            name: 'All Branches'
        }
    ]);

    const { branchesList } = useBranches();

    const [selectedBranch, setselectedBranch] = useState({});
    const [checked, setChecked] = useState(false);
    const [statustypes, setStatusTypes] = useState([
        { id: 1, title: 'Open' },
        { id: 3, title: 'Accepted' },
        { id: 4, title: 'Ready' },
        { id: 2, title: 'Closed' },
        { id: 5, title: 'Rejected' }
    ]);

    useEffect(() => {
        if (branchesList[0]?.id) {
            if (branchZero?.length == 1) {
                //  setBranchZero([...branchZero, ...branchesList])
                //  setselectedBranch( {
                //     id: 0,
                //     name: 'All Branches'
                // })
                setBranchZero((prev) => {
                    setselectedBranch(prev[0]);
                    return [...prev, ...branchesList];
                });
            }
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [branchesList]);

    // const getBranch = async (branch) => {
    //     console.log(branch, 'branch++++++++++');
    //     await branchServices
    //         .getBranchById(branch.id)
    //         .then((res) => {
    //             console.log(res, 'selected Branch============');
    //             setChecked(res.data.result.isBusy);
    //         })
    //         .catch((err) => {
    //             console.log(err.response);
    //         });
    // };

    const makeBranchBusy = async (event) => {
        try {
            // Create a copy of the selectedBranch with the updated isBusy property
            const tempBranch = { ...selectedBranch, isBusy: event.target.checked };

            // Find the index of the selectedBranch in branchZero array
            const selectedIndex = branchZero.findIndex((bran) => bran.id === selectedBranch.id);

            if (selectedIndex >= 0) {
                // Create a copy of branchZero and update the element at the selectedIndex
                const tempBranchZero = [...branchZero];
                tempBranchZero[selectedIndex] = tempBranch;

                // Update the state variable with the new array
                setBranchZero(tempBranchZero);
                setselectedBranch(tempBranch);
            }

            // Update the state variable with the checked property
            setChecked(event.target.checked);

            // Call the asynchronous function to edit the branch
            const res = await branchServices.editBranch(tempBranch);

            // Log the result to the console
            console.log(res, 'updatee**************');
        } catch (err) {
            // Handle any errors that occur during the process
            console.error(err);
        }
    };

    const getOrderTypes = async () => {
        orderServices
            .getOrderTypes()
            .then((res) => {
                setStatusTypes(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response);
            });
    };

    const getAnalytics = async () => {
        await orderServices
            .getAcceptedOrdersNumbers(selectedBranch?.id)
            .then((res) => {
                setAnalytics((prevAnalytics) => ({
                    ...prevAnalytics,
                    accepted: res?.data?.result
                }));
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
        await orderServices
            .getPendingOrdersNumbers(selectedBranch?.id)
            .then((res) => {
                setAnalytics((prevAnalytics) => ({
                    ...prevAnalytics,
                    pending: res?.data?.result
                }));
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
        await orderServices
            .getReadyOrdersNumbers(selectedBranch?.id)
            .then((res) => {
                setAnalytics((prevAnalytics) => ({
                    ...prevAnalytics,
                    ready: res?.data?.result
                }));
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });

        await orderServices
            .getClosedOrdersNumbers(selectedBranch?.id)
            .then((res) => {
                setAnalytics((prevAnalytics) => ({
                    ...prevAnalytics,
                    closed: res?.data?.result
                }));
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
        // await orderServices.getRejectedOrdersNumbers(selectedBranch?.id)
        // .then((res)=>{
        //     setAnalytics(prevAnalytics => ({
        //         ...prevAnalytics,
        //         rejected: res?.data?.result
        //       }));

        // })
        // .catch((err)=>{
        //     console.log(err?.response?.data);
        // })
    };
    // useEffect(() => {
    //     // getOrderTypes()
    // }, []);
    useEffect(() => {
        getAnalytics();
    }, [selectedBranch, reload]);

    useEffect(() => {
    }, [reload]);
    useEffect(() => {
        const interval = setInterval(() => {
            setReload((prev) => !prev);
        }, 10000);

        return () => clearInterval(interval);
    }, []);
    return (
        <Grid container spacing={2}>
            {/* <Grid item xs={6} >
 <Grid container spacing={2} 
   direction="row"
  justifyContent="flex-end"
  alignItems="flex-end"
>

<Grid item xs={3} >
                <AnalyticBox title="Pending" count={analytics?.pending}   />
            </Grid>
            <Grid item xs={3} >
                <AnalyticBox title="Accepted" count={analytics?.accepted}  />
            </Grid>
            <Grid item xs={3} >
                <AnalyticBox title="Closed" count={analytics?.closed}     />
            </Grid>
            <Grid item xs={3} >
                <AnalyticBox title="Rejected" count={analytics?.rejected}    />
            </Grid>
            </Grid>

            </Grid> */}

            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            All Orders
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" justifyContent="space-between">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBranch}
                                label={'Branch'}
                                onChange={(event) => {
                                    setselectedBranch(event.target.value);
                                    setChecked(event.target.value.isBusy);
                                }}
                            >
                                {branchZero.map((row, index) => {
                                    return (
                                        <MenuItem value={row} key={index}>
                                            {row?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        {selectedBranch.id != 0 && (
                            <FormControlLabel
                                control={<Switch checked={checked} onChange={(e) => makeBranchBusy(e)} />}
                                label="Make Branch Busy"
                            />
                        )}
                    </Grid>
                    {/* <Grid item xs={6}>
                    <TableControl type="Customer"/>
                </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={10}>
                        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-end">
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="All Orders"
                                    // count={analytics?.pending}
                                    value={'All'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('All');
                                        setFilterStatus(0);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Pending Orders"
                                    count={analytics?.pending}
                                    value={'Open'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Open');
                                        setFilterStatus(1);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Preparing (Accepted)"
                                    count={analytics?.accepted}
                                    value={'Accepted'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Accepted');
                                        setFilterStatus(3);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Delivered"
                                    count={analytics?.ready}
                                    value={'Ready'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Ready');
                                        setFilterStatus(4);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <AnalyticBox
                                    title="Closed"
                                    count={analytics?.closed}
                                    value={'Close'}
                                    filter={filter}
                                    handleClick={() => {
                                        setFilter('Close');
                                        setFilterStatus(2);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <OrdersTable
                    reload={reload}
                    selectedBranch={selectedBranch}
                    setData={setData}
                    data={data}
                    setModalOpen={setModalOpen}
                    // statustypes={statustypes}
                    filter={filter}
                    // setTimerReload={setTimerReload}
                    filterStatus={filterStatus}
                    setReload={setReload}
                />
            </Grid>
            <OrderDetail modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} data={data} statustypes={statustypes} />
        </Grid>
    );
}
