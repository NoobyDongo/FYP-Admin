'use client'
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Home() {
  /*
  const theme = useTheme();

  const barData = {
    labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: theme.palette.primary.main,
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: [
      'Category 1',
      'Category 2',
      'Category 3'
    ],
    datasets: [
      {
        label: '# of Items',
        data: [50, 30, 20],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          lighten(theme.palette.primary.main, .2)
        ],
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const options = {
    responsive: true,// This will make the chart resize itself when the size of the parent container changes
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  const pieoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left', // This will align the labels vertically on the right side of the chart
        align: 'center', // This will align the labels vertically on the right side of the chart
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14,
            family: 'Arial',
            style: 'bold',
            lineHeight: 1.2,
            width: 1,
          },
        },
      },
    },
    aspectRatio: 1,
  };

*/

  const router = useRouter();

  return (
    <>
      <Button variant="contained" onClick={() => router.push('/admin')} color="primary">
        To Admin
      </Button>
    </>
  );
}