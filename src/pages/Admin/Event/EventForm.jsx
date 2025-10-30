// import React, { useEffect, useState } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Divider,
//   IconButton,
//   Autocomplete,
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteIcon from "@mui/icons-material/Delete";
// import dayjs from "dayjs";
// import axios from "axios";

// // Define the validation schema using Zod
// const eventSchema = z.object({
//   events: z.array(
//     z.object({
//       event_type: z.string().nonempty("Event Type is required"),
//       event_name: z.string().nonempty("Event Name is required"),
//       domain: z.string().nonempty("Domain is required"),
//       hosted_by: z.string().nonempty("Hosted By is required"),
//       create_date: z.string().nonempty("Create Date is required"),
//       start_date: z.string().nonempty("Start Date is required"),
//       end_date: z.string().nonempty("End Date is required"),
//       participants_count: z
//         .number({ invalid_type_error: "Participants Count must be a number" })
//         .min(1, "Participants Count should be at least 1"),
//       completion_count: z
//         .number({ invalid_type_error: "Completion Count must be a number" })
//         .nullable(),
//       remarks: z.string().optional(),
//     })
//   ),
// });

// function EventForm() {
//   const [showAdditionalFields, setShowAdditionalFields] = useState(false);
//   const [domains, setDomains] = useState([]);
//   const token = localStorage.getItem("accessToken");

//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(eventSchema),
//     defaultValues: {
//       events: [
//         {
//           event_type: "",
//           event_name: "",
//           domain: "",
//           hosted_by: "",
//           create_date: "",
//           start_date: "",
//           end_date: "",
//           participants_count: "",
//           completion_count: "",
//           remarks: "",
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "events",
//   });

//   // Fetch domain data from the API
//   useEffect(() => {
//     const fetchDomains = async () => {
//       try {
//         const response = await axios.post(
//           "https://erpapi.eduskillsfoundation.org/internship/domain",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setDomains(
//           response.data.map((domain) => ({
//             label: domain.domain_name,
//             id: domain.domain_id,
//           }))
//         );
//       } catch (error) {
//         console.error("Failed to fetch domains", error);
//       }
//     };
//     fetchDomains();
//   }, [token]);

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   // Define the main and additional input fields arrays
//   const mainFields = [
//     { label: "Event Name", name: "event_name", type: "text" },
//     // { label: "Domain", name: "domain", type: "text" },
//     { label: "Hosted By", name: "hosted_by", type: "text" },
//   ];

//   const additionalFields = [
//     { label: "Participants Count", name: "participants_count", type: "number" },
//     {
//       label: "Completion Count",
//       name: "completion_count",
//       type: "number",
//       placeholder: "null",
//     },
//     { label: "Remarks", name: "remarks", type: "text" },
//   ];

//   const eventTypes = [{ label: "FDP" }];

//   const addAdditionalFields = () => {
//     append(
//       additionalFields.reduce((acc, field) => {
//         acc[field.name] = "";
//         return acc;
//       }, {})
//     );
//     setShowAdditionalFields(true);
//   };

//   const removeAdditionalFields = () => {
//     fields.slice(1).forEach((_, index) => remove(index + 1));
//     setShowAdditionalFields(false);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Card
//         style={{
//           maxWidth: "90%",
//           margin: "8px auto",
//           backgroundColor: "#fff",
//         }}
//         sx={{
//           borderTop: "20px solid",
//           borderLeft: "12px solid",
//           borderRight: "12px solid",
//           borderBottom: "8px solid",
//           borderColor: "#bbdefb",
//           padding: 2,
//         }}
//       >
//         <CardContent>
//           <Typography variant="h6" mb={2} gutterBottom>
//             Create Event
//           </Typography>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Main Fields */}
//             <Grid container spacing={2}>
//               {/* Event Type Autocomplete */}
//               <Grid item xs={12} sm={4}>
//                 <Controller
//                   name="events.0.event_type"
//                   control={control}
//                   render={({ field }) => (
//                     <Autocomplete
//                       options={eventTypes}
//                       getOptionLabel={(option) => option.label || ""}
//                       onChange={(_, value) =>
//                         field.onChange(value ? value.label : "")
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Event Type"
//                           placeholder="Select Event Type"
//                           error={!!errors?.events?.[0]?.event_type}
//                           helperText={errors?.events?.[0]?.event_type?.message}
//                           fullWidth
//                           size="small"
//                         />
//                       )}
//                     />
//                   )}
//                 />
//               </Grid>

//               {mainFields.map((field) => (
//                 <Grid item xs={12} sm={4} key={field.name}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label={field.label}
//                     type={field.type}
//                     placeholder={field.placeholder || ""}
//                     {...register(`events.0.${field.name}`)}
//                     error={!!errors?.events?.[0]?.[field.name]}
//                     helperText={errors?.events?.[0]?.[field.name]?.message}
//                   />
//                 </Grid>
//               ))}

//               <Grid item xs={12} sm={4}>
//                 <Controller
//                   name="events.0.domain"
//                   control={control}
//                   render={({ field }) => (
//                     <Autocomplete
//                       options={domains}
//                       getOptionLabel={(option) => option.label}
//                       onChange={(_, value) =>
//                         field.onChange(value ? value.label : "")
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Domain"
//                           placeholder="Select Domain"
//                           error={!!errors?.events?.[0]?.domain}
//                           helperText={errors?.events?.[0]?.domain?.message}
//                           fullWidth
//                           size="small"
//                         />
//                       )}
//                     />
//                   )}
//                 />
//               </Grid>

//               {/* Date Pickers */}
//               <Grid item xs={12} sm={4}>
//                 <Controller
//                   name="events.0.create_date"
//                   control={control}
//                   render={({ field }) => (
//                     <DatePicker
//                       label="Create Date"
//                       value={field.value ? dayjs(field.value) : null}
//                       views={["year", "month", "day"]}
//                       onChange={(date) =>
//                         field.onChange(date ? date.toISOString() : "")
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           fullWidth
//                           size="small"
//                           error={!!errors?.events?.[0]?.create_date}
//                           helperText={errors?.events?.[0]?.create_date?.message}
//                         />
//                       )}
//                     />
//                   )}
//                 />
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 3 }} />

//             {/* Button to show additional fields */}
//             <Button
//               startIcon={<AddCircleOutlineIcon />}
//               onClick={addAdditionalFields}
//               sx={{ mt: 2 }}
//               color="success"
//               variant="outlined"
//               disabled={showAdditionalFields} // Disable if additional fields are added
//             >
//               Add Additional Fields
//             </Button>

//             {showAdditionalFields && (
//               <IconButton
//                 onClick={removeAdditionalFields}
//                 color="error"
//                 sx={{ mt: 2, ml: 1 }}
//               >
//                 <DeleteIcon />
//               </IconButton>
//             )}

//             {/* Conditionally render additional fields */}
//             {showAdditionalFields && (
//               <Grid container spacing={2} sx={{ mt: 2, padding: 2 }}>
//                 {fields.slice(1).map((item, index) => (
//                   <Grid container spacing={2} key={item.id}>
//                     {/* Date Pickers for Start and End Dates */}
//                     <Grid item xs={12} sm={4}>
//                       <Controller
//                         name={`events.${index + 1}.start_date`}
//                         control={control}
//                         render={({ field }) => (
//                           <DatePicker
//                             label="Start Date"
//                             value={field.value ? dayjs(field.value) : null}
//                             onChange={(date) =>
//                               field.onChange(date ? date.toISOString() : "")
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 fullWidth
//                                 size="small"
//                                 error={
//                                   !!errors?.events?.[index + 1]?.start_date
//                                 }
//                                 helperText={
//                                   errors?.events?.[index + 1]?.start_date
//                                     ?.message
//                                 }
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <Controller
//                         name={`events.${index + 1}.end_date`}
//                         control={control}
//                         render={({ field }) => (
//                           <DatePicker
//                             label="End Date"
//                             value={field.value ? dayjs(field.value) : null}
//                             onChange={(date) =>
//                               field.onChange(date ? date.toISOString() : "")
//                             }
//                             views={["year", "month", "day"]}
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 fullWidth
//                                 size="small"
//                                 error={!!errors?.events?.[index + 1]?.end_date}
//                                 helperText={
//                                   errors?.events?.[index + 1]?.end_date?.message
//                                 }
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Grid>

//                     {/* Other additional fields */}
//                     {additionalFields.map((field) => (
//                       <Grid item xs={12} sm={4} key={field.name}>
//                         <TextField
//                           fullWidth
//                           size="small"
//                           label={field.label}
//                           type={field.type}
//                           placeholder={field.placeholder || ""}
//                           {...register(`events.${index + 1}.${field.name}`)}
//                           error={!!errors?.events?.[index + 1]?.[field.name]}
//                           helperText={
//                             errors?.events?.[index + 1]?.[field.name]?.message
//                           }
//                         />
//                       </Grid>
//                     ))}
//                   </Grid>
//                 ))}
//               </Grid>
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               color="info"
//               sx={{ mt: 2, ml: `${showAdditionalFields ? 0 : 1.5}rem` }}
//             >
//               Submit
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </LocalizationProvider>
//   );
// }

// export default EventForm;

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";

// Define the validation schema using Zod
const eventSchema = z.object({
  events: z.array(
    z.object({
      event_type: z.string().nonempty("Event Type is required"),
      event_name: z.string().nonempty("Event Name is required"),
      domain: z.string().nonempty("Domain is required"),
      hosted_by: z.string().nonempty("Hosted By is required"),
      create_date: z.string().nonempty("Create Date is required"),
      start_date: z.string().nonempty("Start Date is required"),
      end_date: z.string().nonempty("End Date is required"),
      participants_count: z
        .number({ invalid_type_error: "Participants Count must be a number" })
        .min(1, "Participants Count should be at least 1"),
      completion_count: z
        .number({ invalid_type_error: "Completion Count must be a number" })
        .nullable(),
      remarks: z.string().optional(),
    })
  ),
});

function EventForm() {
  const [domains, setDomains] = useState([]);
  const token = localStorage.getItem("accessToken");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      events: [
        {
          event_type: "",
          event_name: "",
          domain: "",
          hosted_by: "",
          create_date: "",
          start_date: "",
          end_date: "",
          participants_count: "",
          completion_count: "",
          remarks: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "events",
  });

  // Fetch domain data from the API
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.post(
          "https://erpapi.eduskillsfoundation.org/internship/domain",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDomains(
          response.data.map((domain) => ({
            label: domain.domain_name,
            id: domain.domain_id,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch domains", error);
      }
    };
    fetchDomains();
  }, [token]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const mainFields = [
    { label: "Event Name", name: "event_name", type: "text" },
    { label: "Hosted By", name: "hosted_by", type: "text" },
  ];

  const additionalFields = [
    { label: "Participants Count", name: "participants_count", type: "number" },
    {
      label: "Completion Count",
      name: "completion_count",
      type: "number",
      placeholder: "null",
    },
    {
      label: "Remarks",
      name: "remarks",
      type: "text",
      multiline: true,
      rows: 2, // Make it a 2-row textarea
    },
  ];

  const eventTypes = [{ label: "FDP" }];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        style={{
          maxWidth: "90%",
          margin: "8px auto",
          backgroundColor: "#fff",
        }}
        sx={{
          borderTop: "20px solid",
          borderLeft: "12px solid",
          borderRight: "12px solid",
          borderBottom: "8px solid",
          borderColor: "#bbdefb",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" mb={2} gutterBottom>
            Create Event
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="events.0.event_type"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={eventTypes}
                      getOptionLabel={(option) => option.label || ""}
                      onChange={(_, value) =>
                        field.onChange(value ? value.label : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Event Type"
                          placeholder="Select Event Type"
                          error={!!errors?.events?.[0]?.event_type}
                          helperText={errors?.events?.[0]?.event_type?.message}
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {mainFields.map((field) => (
                <Grid item xs={12} sm={4} key={field.name}>
                  <TextField
                    fullWidth
                    size="small"
                    label={field.label}
                    type={field.type}
                    {...register(`events.0.${field.name}`)}
                    error={!!errors?.events?.[0]?.[field.name]}
                    helperText={errors?.events?.[0]?.[field.name]?.message}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={4}>
                <Controller
                  name="events.0.domain"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={domains}
                      getOptionLabel={(option) => option.label}
                      onChange={(_, value) =>
                        field.onChange(value ? value.label : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Domain"
                          placeholder="Select Domain"
                          error={!!errors?.events?.[0]?.domain}
                          helperText={errors?.events?.[0]?.domain?.message}
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="events.0.create_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Create Date"
                      value={field.value ? dayjs(field.value) : null}
                      views={["year", "month", "day"]}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          error={!!errors?.events?.[0]?.create_date}
                          helperText={errors?.events?.[0]?.create_date?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="events.0.start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          error={!!errors?.events?.[0]?.start_date}
                          helperText={errors?.events?.[0]?.start_date?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="events.0.end_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="End Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      views={["year", "month", "day"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          error={!!errors?.events?.[0]?.end_date}
                          helperText={errors?.events?.[0]?.end_date?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {additionalFields.map((field) => (
                <Grid
                  item
                  xs={field.name === "remarks" ? 12 : 4}
                  key={field.name}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    multiline={field.multiline || false}
                    rows={field.rows || 1}
                    {...register(`events.0.${field.name}`)}
                    error={!!errors?.events?.[0]?.[field.name]}
                    helperText={errors?.events?.[0]?.[field.name]?.message}
                  />
                </Grid>
              ))}
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="info"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

export default EventForm;
