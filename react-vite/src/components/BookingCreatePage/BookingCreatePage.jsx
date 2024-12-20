import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import * as bookingActions from "../../redux/booking";
import { getAllServices } from "../../redux/service";
import { fetchPetDetail } from "../../redux/pets";
import bcp from "./BookingCreatePage.module.css";
import 'react-calendar/dist/Calendar.css';

const BookingCreatePage = () => {
  const { petId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentBooking = useSelector((state) => state.booking.booking);
  const servicesArr = useSelector((state) => state.service.services.services)
  const pet = useSelector((state) => state.pets.selectedPet)
  const [bookingType, setBookingType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFirstDate, setIsFirstDate] = useState(false);
  const [dropOffDate, setDropOffDate] = useState(null);
  const [pickUpDate, setPickUpDate] = useState(null);
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickUpTime, setPickUpTime] = useState(null);
  const [selectedServices, setSelectedServices] = useState([])
  const [isReservationStarted, setIsReservationStarted] = useState(false)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    dispatch(bookingActions.getBookingByPetId(petId));
    if (currentBooking && currentBooking.booking) {
      const dropOffDate = new Date(currentBooking.booking.drop_off_date)
      if (dropOffDate <= today) {
        setIsReservationStarted(true)
      } else {
        setIsReservationStarted(false)
      }
    }
    if (!currentBooking || !currentBooking.booking) {
      dispatch(getAllServices())
    }
  }, [petId, currentBooking?.booking?.drop_off_date, dispatch]);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);

    const formattedDate = date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    });

    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    })

    return `${formattedDate} ${formattedTime}`;
  }

  const combineDateAndTime = (date, time) => {
    console.log('date & time > ', date, time);
  
    // Split the time into hours and minutes
    const [hours, minutes] = time.split(":");
  
    // Set the time to the provided date
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
  
    // Format the date and time in the desired format "YYYY-MM-DD HH:mm:ss"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const formattedHours = String(date.getHours()).padStart(2, '0');
    const formattedMinutes = String(date.getMinutes()).padStart(2, '0');
    const formattedSeconds = String(date.getSeconds()).padStart(2, '0');
  
    // Combine and return the formatted string
    return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (date < today) {
        return bcp.pastDate; // Past dates
      }
      if (dropOffDate && date.toDateString() === dropOffDate.toDateString()) {
        return bcp.selectedDate; // Highlight drop-off date
      }
      if (pickUpDate && date.toDateString() === pickUpDate.toDateString()) {
        return bcp.selectedDate; // Highlight pick-up date
      }
      if (dropOffDate && pickUpDate && date >= dropOffDate && date <= pickUpDate) {
        return bcp.dateRange; // Highlight range between drop-off and pick-up dates
      }
      if (date.toDateString() === selectedDate?.toDateString()) {
        return bcp.selectedDate; // Highlight selected date (day_care)
      }
    }
    return null; // Default case
  };

  const handleBookingTypeSelection = (type) => {
    setBookingType(type);
    setSelectedDate(null);
    setDropOffDate(null);
    setPickUpDate(null);
    setIsFirstDate(false);
    setDropOffTime(null);
    setPickUpTime(null);
    setSelectedServices([]);
  };

  const handleDateSelection = (date) => {
    if (bookingType === "day_care") {
      setSelectedDate(date);
      setDropOffDate(date);
      setPickUpDate(date);
    } else if (bookingType === "boarding_care") {
      if (!dropOffDate || (dropOffDate && pickUpDate)) {
        setDropOffDate(date);
        setPickUpDate(null);
        setIsFirstDate(true);
      } else {
        setPickUpDate(date);
        setIsFirstDate(false);
      }
    }
    console.log('drop & pick > ', dropOffDate, pickUpDate)
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target
    const serviceId = parseInt(value);
    
    if (checked) {
      setSelectedServices((prevSelectedServices) => [...prevSelectedServices, serviceId])
    } else (
      setSelectedServices((prevSelectedServices) => 
        prevSelectedServices.filter((id) => id !== serviceId)
      )
    )
  }

  const handleSubmit = async () => {
    try {
      await dispatch(fetchPetDetail(petId))

      if (!pet || !pet.owner_id) {
        console.log('Pet details not available.');
        return
      }

      const bookingData = {
        client_id: Number(pet.owner_id),
        pet_id: Number(petId),
        booking_type: bookingType,
        drop_off_date: combineDateAndTime(dropOffDate, dropOffTime),
        pick_up_date: combineDateAndTime(pickUpDate, pickUpTime),
        services: selectedServices
      }
      console.log('bookingData > ', bookingData)
      await dispatch(bookingActions.createBooking(bookingData));
      navigate(`/bookings/pet/${petId}`)
    } catch (error) {
      console.error('Error during booking submission:', error);
    } 
  };

  return (
    <div className={bcp.mainContainer}>
      <h1 className={bcp.h1}>Book Reservation</h1>
      {currentBooking && currentBooking.booking ? (
        <div className={bcp.currBookContainer}>
          <h2 className={bcp.currBookTitle}>Current Reservation Information</h2>
          <p className={bcp.currBookType}>Type: {currentBooking.booking.booking_type}</p>
          <p className={bcp.currBookDates}>
            Date(s):{" "}
            {currentBooking.booking.date_off_date ||
              `${formatDateTime(currentBooking.booking.drop_off_date)} - ${formatDateTime(currentBooking.booking.pick_up_date)}`}
          </p>
          <div className={bcp.currServicesContainer}>
            {currentBooking.booking.services.map((service) => (
              <div key={service.id}>
                <p className={bcp.currServicesDetail}>{service.service}</p>
              </div> 
              ))}
          </div>
          {isReservationStarted && (
            <h3 className={bcp.reserveStartedMsg}>Reservation has started, cannot Update & Delete</h3>
          )}
          <button
            className={bcp.currBookBtnUpdate}
            // onClick={() => dispatch(updateBooking(currentBooking.id))}
            disabled={isReservationStarted}
          >
            Update
          </button>
          <button
            className={bcp.currBookBtnDelete}
            // onClick={() => dispatch(deleteBooking(currentBooking.id))}
            disabled={isReservationStarted}
          >
            Delete
          </button>
        </div>
      ) : (
      <>  
      <div className={bcp.bookTypeBtnContainer}>
        <button
          className={bcp.bookDayCareBtn}
          onClick={() => handleBookingTypeSelection("day_care")}
        >
          Day Care
        </button>
        <button
          className={bcp.bookBrdCareBtn}
          onClick={() => handleBookingTypeSelection("boarding_care")}
        >
          Boarding Care
        </button>
      </div>
      
      <div className={bcp.bookReservationWrapper}>
        {/* Conditional Date Selection Based on Booking Type */}
        {bookingType && (
          <div className={bcp.calendarContainer}>
            <h3 className={bcp.calendarMainTitle}>Select Dates</h3>
            
            {/* Only show one calendar for day_care */}
            {bookingType === "day_care" && (
              <div className={bcp.calendarWrapperDayCare}>
                <Calendar
                  onChange={handleDateSelection}
                  value={selectedDate}
                  className={bcp.calendarDropDate}
                  locale="en-US"
                  showNeighboringMonth={false}
                  minDate={today}
                  tileClassName={tileClassName}
                />
              </div>
            )}

            {bookingType === "boarding_care" && (
              <div className={bcp.calendarContainerBoardingCare}>
                <h4>Drop-Off and Pick-Up Date</h4>
                
                {/* First calendar for current month */}
                <div className={bcp.calendarWrapperBoardingCare}>
                  <Calendar
                    onChange={handleDateSelection}
                    value={dropOffDate || pickUpDate} // Either drop-off or pick-up can be selected
                    className={bcp.calendarDropOff}
                    locale="en-US"
                    showNeighboringMonth={false}
                    minDate={today}
                    tileClassName={tileClassName} // Apply custom tile classes for past dates and selected date
                  />
                </div>
              </div>
            )}

            {/* Show selected dates */}
            <p className={bcp.selectDate}>
              {bookingType === "day_care"
                ? `Selected Date: ${selectedDate ? selectedDate.toLocaleDateString() : "None"}`
                : `Drop-Off Date: ${dropOffDate ? dropOffDate.toLocaleDateString() : "None"} 
                  | Pick-Up Date: ${pickUpDate ? pickUpDate.toLocaleDateString() : "None"}`}
            </p>
          </div>
        )}

        {(selectedDate || (dropOffDate && pickUpDate)) && (
          <div className={bcp.selectTimesContainer}>
            <h3 className={bcp.selectTimesTitle}>Select Times</h3>
            
            {/* Drop-Off Time Selection */}
            <div className={bcp.dropOffContainer}>
              <label className={bcp.dropOffTitle}>Drop-Off Time:</label>
              <select
                className={bcp.dropOffInput}
                value={dropOffTime || ""}
                onChange={(e) => setDropOffTime(e.target.value)}
              >
                <option value="" disabled>Select a time</option>
                {Array.from({ length: 13 }, (_, i) => 6 + i).map((hour) => (
                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Pick-Up Time Selection */}
            <div className={bcp.pickUpContainer}>
              <label className={bcp.pickUpTitle}>Pick-Up Time:</label>
              <select
                className={bcp.pickUpInput}
                value={pickUpTime || ""}
                onChange={(e) => setPickUpTime(e.target.value)}
              >
                <option value="" disabled>Select a time</option>
                {Array.from({ length: 12 }, (_, i) => 7 + i).map((hour) => (
                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {dropOffTime && pickUpTime && (
          <div className={bcp.serviceListContainer}>
            <h3 className={bcp.serviceListTitle}>Select Services</h3>
            <p>Need to choose at least of the services</p>
            <div>
              {servicesArr.map((service) => (
                <div key={service.id}>
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    name="service"
                    value={service.id}
                    checked={selectedServices.includes(service.id)}
                    onChange={handleServiceChange}
                  />
                  <label htmlFor={`service-${service.id}`}>{service.service}</label>
                </div> 
              ))}
            </div>
            <button 
              className={bcp.submitButton} 
              onClick={handleSubmit}
              disabled={isFirstDate || selectedServices.length === 0}>
              Submit Booking
            </button>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default BookingCreatePage;