import { Button, Typography, Grid } from '@mui/material'; 
import RewardsCollection from 'features/Rewards/collection/index';
import { Link, useNavigate, useParams } from 'react-router-dom'; 

export default function RewardCollection() {
    const { type } = useParams();

    const navigate = useNavigate();
   
    
  return (
    <Grid container spacing={2}>
 
 <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">

                        <Grid item xs="auto">
                            <Typography variant="h5">Reward Collection</Typography>
                        </Grid>

                        {/* <Grid item xs="auto">
                            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}
                                // onClick={() => openNewMarketModel()}
                            >
                                Create New reward Collection
                            </Button>
                        </Grid> */}

                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <RewardsCollection />
                  
                </Grid>
    </Grid>
  );
}
