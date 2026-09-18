import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function SessionsChart(props) {
  const theme = useTheme();
  const { d, order, h = 170, title, caption } = props;

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const lastValue = d && d.length > 0 ? d[d.length - 1] : 0;
  const firstValue = d && d.length > 0 ? d[0] : 0;
  const pctChange = lastValue > 0 ? ((Math.abs(firstValue - lastValue) / lastValue) * 100).toFixed(1) : '0.0';

  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        borderRadius: '12px',
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700, color: '#1B3B6F', mb: 1 }}>
          {title}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B3B6F', lineHeight: 1 }}>
              {typeof lastValue === 'number' ? lastValue.toFixed(2) : lastValue}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
              {caption}
            </Typography>
          </Box>

          <Chip
            size="small"
            color="success"
            label={`${firstValue <= lastValue ? '+' : '-'}${pctChange}%`}
            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
          />
        </Stack>

        <Box sx={{ width: '100%', height: h, minWidth: 0 }}>
          <LineChart
            colors={colorPalette}
            series={[
              {
                id: 'direct',
                label: title,
                showMark: false,
                curve: 'linear',
                stack: 'total',
                area: true,
                stackOrder: order,
                data: d || [],
              },
            ]}
            height={h}
            margin={{ left: 45, right: 15, top: 15, bottom: 20 }}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiAreaElement-series-direct': {
                fill: "url('#direct')",
              },
            }}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <AreaGradient color={theme.palette.primary.main} id="direct" />
          </LineChart>
        </Box>
      </CardContent>
    </Card>
  );
}

SessionsChart.propTypes = {
  d: PropTypes.array,
  order: PropTypes.string,
  h: PropTypes.number,
  title: PropTypes.string,
  caption: PropTypes.string,
};
