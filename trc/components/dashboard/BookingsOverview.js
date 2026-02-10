import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BookingsOverview = () => {
  const [bookings, setBookings] = useState({});
  const [customerDetails, setCustomerDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch bookings data for the chart
        const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getbookingsdata`);
        const bookingsData = await bookingsResponse.json();
        console.log("Bookings API Response:", bookingsData);
        setBookings(bookingsData);

        // Fetch customer details for the table
        const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getcustomerdetails`);
        const customerData = await customerResponse.json();
        console.log("Customer API Response:", customerData);
        
        if (customerData.success) {
          setCustomerDetails(customerData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const optionsBookingsOverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },
  
    colors: ["#4caf50", "#2196f3", "#ff9800"], // Green for total, Blue for confirmed, Orange for checked-in
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: {
        colors: '#adb0bb'
      }
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
      ],
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      tickAmount: 6,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function(val) {
          return val + " bookings";
        }
      }
    },
  };

  // Extract numeric data for chart series with detailed debugging and fallbacks
  const totalBookingsData = [
    typeof bookings.jan?.total === 'number' ? bookings.jan.total : 0,
    typeof bookings.feb?.total === 'number' ? bookings.feb.total : 0,
    typeof bookings.mar?.total === 'number' ? bookings.mar.total : 0,
    typeof bookings.apr?.total === 'number' ? bookings.apr.total : 0,
    typeof bookings.may?.total === 'number' ? bookings.may.total : 0,
    typeof bookings.jun?.total === 'number' ? bookings.jun.total : 0,
    typeof bookings.jul?.total === 'number' ? bookings.jul.total : 0,
    typeof bookings.aug?.total === 'number' ? bookings.aug.total : 0,
    typeof bookings.sept?.total === 'number' ? bookings.sept.total : 0,
    typeof bookings.oct?.total === 'number' ? bookings.oct.total : 0,
    typeof bookings.nov?.total === 'number' ? bookings.nov.total : 0,
    typeof bookings.dec?.total === 'number' ? bookings.dec.total : 0,
  ];

  const confirmedBookingsData = [
    typeof bookings.jan?.confirmed === 'number' ? bookings.jan.confirmed : 0,
    typeof bookings.feb?.confirmed === 'number' ? bookings.feb.confirmed : 0,
    typeof bookings.mar?.confirmed === 'number' ? bookings.mar.confirmed : 0,
    typeof bookings.apr?.confirmed === 'number' ? bookings.apr.confirmed : 0,
    typeof bookings.may?.confirmed === 'number' ? bookings.may.confirmed : 0,
    typeof bookings.jun?.confirmed === 'number' ? bookings.jun.confirmed : 0,
    typeof bookings.jul?.confirmed === 'number' ? bookings.jul.confirmed : 0,
    typeof bookings.aug?.confirmed === 'number' ? bookings.aug.confirmed : 0,
    typeof bookings.sept?.confirmed === 'number' ? bookings.sept.confirmed : 0,
    typeof bookings.oct?.confirmed === 'number' ? bookings.oct.confirmed : 0,
    typeof bookings.nov?.confirmed === 'number' ? bookings.nov.confirmed : 0,
    typeof bookings.dec?.confirmed === 'number' ? bookings.dec.confirmed : 0,
  ];

  const checkedInData = [
    typeof bookings.jan?.checkedIn === 'number' ? bookings.jan.checkedIn : 0,
    typeof bookings.feb?.checkedIn === 'number' ? bookings.feb.checkedIn : 0,
    typeof bookings.mar?.checkedIn === 'number' ? bookings.mar.checkedIn : 0,
    typeof bookings.apr?.checkedIn === 'number' ? bookings.apr.checkedIn : 0,
    typeof bookings.may?.checkedIn === 'number' ? bookings.may.checkedIn : 0,
    typeof bookings.jun?.checkedIn === 'number' ? bookings.jun.checkedIn : 0,
    typeof bookings.jul?.checkedIn === 'number' ? bookings.jul.checkedIn : 0,
    typeof bookings.aug?.checkedIn === 'number' ? bookings.aug.checkedIn : 0,
    typeof bookings.sept?.checkedIn === 'number' ? bookings.sept.checkedIn : 0,
    typeof bookings.oct?.checkedIn === 'number' ? bookings.oct.checkedIn : 0,
    typeof bookings.nov?.checkedIn === 'number' ? bookings.nov.checkedIn : 0,
    typeof bookings.dec?.checkedIn === 'number' ? bookings.dec.checkedIn : 0,
  ];

  // Debug the extracted data
  console.log("Extracted totalBookingsData:", totalBookingsData);
  console.log("Extracted confirmedBookingsData:", confirmedBookingsData);
  console.log("Extracted checkedInData:", checkedInData);

  const seriesBookingsOverview = [
    {
      name: "Total Bookings",
      data: totalBookingsData,
    },
    {
      name: "Confirmed Bookings", 
      data: confirmedBookingsData,
    },
    {
      name: "Checked-in Guests",
      data: checkedInData,
    },
  ];

  // Check if all data values are zero (no bookings)
  const allDataAreZero = seriesBookingsOverview.every(series => 
    series.data.every(item => item === 0)
  );

  // Validate that all series have valid data
  const hasValidData = seriesBookingsOverview.every(series => 
    Array.isArray(series.data) && 
    series.data.length > 0 && 
    series.data.every(item => typeof item === 'number' && !isNaN(item))
  ) && !allDataAreZero;

  console.log("Has valid data:", hasValidData);
  console.log("All data are zero:", allDataAreZero);
  console.log("Series data validation:", seriesBookingsOverview.map(s => ({
    name: s.name,
    isValid: Array.isArray(s.data) && s.data.length > 0 && s.data.every(item => typeof item === 'number' && !isNaN(item)),
    data: s.data
  })));

  return (
    <BaseCard title="Room Bookings Overview">
      {/* Bookings Chart */}
      <Box sx={{ mb: 4 }}>
        {Object.keys(bookings).length > 0 && hasValidData ? (
          <Chart 
            options={optionsBookingsOverview} 
            series={seriesBookingsOverview} 
            type="bar" 
            height="295px" 
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '295px', textAlign: 'center' }}>
            {Object.keys(bookings).length > 0 && allDataAreZero ? (
              <>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Bookings Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  There are no room bookings for the current year yet.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Bookings will appear here once reservations are made.
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading booking data...
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Customer Details Table */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Recent Customer Bookings
        </Typography>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading customer details...
          </Typography>
        ) : customerDetails.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="customer details table">
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Guest Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Room Class</TableCell>
                  <TableCell>Check-in Date</TableCell>
                  <TableCell>Check-out Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerDetails.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {customer.bookingId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.guestName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {customer.guestEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {customer.guestPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.roomNumber} {customer.roomName && `(${customer.roomName})`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.roomClass}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.checkinDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.checkoutDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {customer.duration} night(s)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.bookingStatus} 
                        size="small"
                        color={
                          customer.bookingStatus === 'confirmed' ? 'success' :
                          customer.bookingStatus === 'checked-in' ? 'primary' :
                          customer.bookingStatus === 'checked-out' ? 'default' :
                          customer.bookingStatus === 'cancelled' ? 'error' : 'warning'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No customer bookings found.
          </Typography>
        )}
      </Box>
    </BaseCard>
  );
};

export default BookingsOverview;