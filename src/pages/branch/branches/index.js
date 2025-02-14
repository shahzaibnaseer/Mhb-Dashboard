import { Grid, Typography, Button } from '@mui/material';
import { TableControl, BranchesTable } from 'features';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NewBranch from 'components/branches/newBranch';
import { useSnackbar } from 'notistack';
export default function Branches() {
    const { type } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={'auto'}>
                            <Typography fontSize={22} fontWeight={700}>
                                Stores
                            </Typography>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Button
                                size="small"
                                variant="contained"
                                sx={{ textTransform: 'capitalize' }}
                                onClick={() =>{ navigate('/locationAddEdit')}}
                            >
                                Create New Store
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <BranchesTable
                        type="Branch"
                        reload={reload}
                        setUpdate={setUpdate}
                        setUpdateData={setUpdateData}
                        setModalOpen={setModalOpen}
                    />
                </Grid>

                <NewBranch
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    setReload={setReload}
                    update={update}
                    updateData={updateData}
                />
            </Grid>
        </>
    );
}
