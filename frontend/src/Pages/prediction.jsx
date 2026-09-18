import './prediction.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const prediction = () => {
 
   
 
  return (
    <Box className='inp'
      component="form"
      sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        paddingLeft: '23vw', 
        paddingRight: '22vw', 
        paddingTop: '4vw', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > :not(style)': { m: 1, width: '100%', maxWidth: '400px' } 
      }}
      noValidate
      autoComplete="off">
      <h1 className='hed' style={{ color: '#274C77' }}>Enter Details</h1>
      <TextField id="outlined-basic" label="Input 1" variant="outlined" sx={{background:'white'}}/>
      <TextField id="outlined-basic" label="Input 2" variant="outlined" sx={{background:'white'}}/>
      <TextField id="outlined-basic" label="Input 3" variant="outlined" sx={{background:'white'}}/>
    </Box>
  );
}

   


export default prediction
