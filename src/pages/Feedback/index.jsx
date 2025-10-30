import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
// import { useEffect } from "react";
import { HomeService } from "../../services/dataService";

const StyledTextField = styled(TextField)({
  width: "100%",
  marginTop: "20px",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", // Change button background color to blue
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)", // Update box shadow color
  color: "white",
  height: 48,
  padding: "0 30px",
});

const StyledBox = styled(Box)({
  marginTop: "40px",
  padding: "20px",
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
});

const StyledRating = styled(Rating)({
  //   color: "#0078d4", // Change the star rating color to blue
});

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const feedbackData = {
    rating: rating,
    comment: feedback,
  };

  const handleFeedbackChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 250) {
      setFeedback(inputValue);
    }
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      // position: "top-center",
    });
  }
  function handleWornMessage(message) {
    toast.warning(message, {
      autoClose: 2000,
      // position: "top-center",
    });
  }
  const isSubmitDisabled = rating === 0 || feedback.trim().length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isSubmitDisabled) {
      try {
        const response = await HomeService.feedback(feedbackData);

        handleSuccessMessage(response.data?.detail);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setFeedback("");
      setRating(0);
    } else {
      handleWornMessage("Please provide a rating and feedback message.");
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledBox>
        <Typography
          variant="h4"
          color="#FF8E53"
          fontWeight={600}
          align="center"
          gutterBottom
        >
          Rate your experience
        </Typography>
        <Typography
          variant="body1"
          my={2}
          align="center"
          color="gray"
          gutterBottom
        >
          We highly value your feedback! Kindly take a moment to rate your
          experience and provide us with your valuable feedback.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ textAlign: "center" }}>
            <StyledRating
              name="rating"
              value={rating}
              onChange={handleRatingChange}
              size="large"
            />
          </Box>
          <StyledTextField
            multiline
            rows={4}
            variant="outlined"
            label="Tell us about your experience!"
            value={feedback}
            color="warning"
            onChange={handleFeedbackChange}
            inputProps={{ maxLength: 250 }}
          />
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitDisabled}
          >
            Submit Feedback
            {/* send */}
          </StyledButton>
        </form>
      </StyledBox>
    </Container>
  );
};

export default FeedbackForm;
// import React, { useState } from "react";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
// import Rating from "@mui/material/Rating";
// import { styled } from "@mui/material/styles";
// import { toast } from "react-toastify";
// import { useEffect } from "react";
// import { HomeService } from "../../services/dataService";

// const StyledTextField = styled(TextField)({
//   width: "100%",
//   marginTop: "20px",
// });

// const StyledButton = styled(Button)({
//   marginTop: "20px",
//   background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
//   border: 0,
//   borderRadius: 3,
//   boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
//   color: "white",
//   height: 48,
//   padding: "0 30px",
// });

// const StyledBox = styled(Box)({
//   marginTop: "40px",
//   padding: "20px",
//   border: "1px solid #e0e0e0",
//   borderRadius: "10px",
// });

// const StyledRating = styled(Rating)({});

// const FeedbackForm = () => {
//   const [feedback, setFeedback] = useState("");
//   const [rating, setRating] = useState(0);
//   const [feedbackError, setFeedbackError] = useState("");
//   const [ratingError, setRatingError] = useState("");

//   const feedbackData = {
//     rating: rating,
//     comment: feedback,
//   };

//   const handleFeedbackChange = (event) => {
//     const inputValue = event.target.value;
//     if (inputValue.length <= 250) {
//       setFeedback(inputValue);
//       setFeedbackError("");
//     } else {
//       setFeedbackError("Feedback should be less than 250 characters");
//     }
//   };

//   const handleRatingChange = (event, newValue) => {
//     setRating(newValue);
//     setRatingError("");
//   };

//   function handleSuccessMessage(message) {
//     toast.success(message, {
//       autoClose: 2000,
//     });
//   }
//   function handleWarningMessage(message) {
//     toast.warning(message, {
//       autoClose: 2000,
//     });
//   }
//   const isSubmitDisabled = rating === 0 || feedback.trim().length === 0;

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!isSubmitDisabled) {
//       try {
//         const response = await HomeService.feedback(feedbackData);
//         console.log(response.data);

//         handleSuccessMessage(response.data?.detail);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }

//       setFeedback("");
//       setRating(0);
//     } else {
//       handleWarningMessage("Please provide a rating and feedback message.");
//       if (rating === 0) {
//         setRatingError("Please provide a rating.");
//       }
//       if (feedback.trim().length === 0) {
//         setFeedbackError("Please provide feedback.");
//       }
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <StyledBox>
//         <Typography
//           variant="h4"
//           color="#FF8E53"
//           fontWeight={600}
//           align="center"
//           gutterBottom
//         >
//           Rate your experience
//         </Typography>
//         <Typography
//           variant="body1"
//           my={2}
//           align="center"
//           color="gray"
//           gutterBottom
//         >
//           We highly value your feedback! Kindly take a moment to rate your
//           experience and provide us with your valuable feedback.
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Box sx={{ textAlign: "center" }}>
//             <StyledRating
//               name="rating"
//               value={rating}
//               onChange={handleRatingChange}
//               size="large"
//               error={Boolean(ratingError)}
//             />
//             {ratingError && (
//               <Typography variant="body2" color="error">
//                 {ratingError}
//               </Typography>
//             )
//             }
//           </Box>
//           <StyledTextField
//             multiline
//             rows={4}
//             variant="outlined"
//             label="Tell us about your experience!"
//             value={feedback}
//             onChange={handleFeedbackChange}
//             inputProps={{ maxLength: 250 }}
//             error={Boolean(feedbackError)}
//           />
//           {feedbackError && (
//             <Typography variant="body2" color="error">
//               {feedbackError}
//             </Typography>
//           )
//           }
//           <StyledButton
//             type="submit"
//             variant="contained"
//             fullWidth
//             disabled={isSubmitDisabled}
//           >
//             Submit Feedback
//           </StyledButton>
//         </form>
//       </StyledBox>
//     </Container>
//   );
// };

// export default FeedbackForm;
