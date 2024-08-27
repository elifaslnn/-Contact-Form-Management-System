import { useState } from "react";
import "./form.css";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { CssBaseline, Alert } from "@mui/material";
import { TextField, Autocomplete, Button } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect } from "react";

const StyledToolBar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

function Form() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [allcountry, allsetCountry] = useState([]);

  const [alert, setAlert] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await fetch("http://localhost:5165/api/countries");
        const data = await response.json();
        allsetCountry(data.data.countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    getCountries();
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = name ? "" : "Name is required.";
    tempErrors.country = country ? "" : "Country is required.";
    tempErrors.gender = gender ? "" : "Gender is required.";
    tempErrors.message = message ? "" : "Message is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((error) => error === "");
  };

  const sendMessage = async () => {
    if (validate()) {
      try {
        const jsonData = {
          name: name,
          gender: gender,
          country: country,
          message: message,
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        };
        const response = await fetch(
          "http://localhost:5165/api/message/add",
          options
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setAlert(true);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  const defaultProps = {
    options: allcountry,
    getOptionLabel: (option) => option,
  };

  return (
    <>
      <CssBaseline />

      <div className="container">
        <Grid className="main" container rowSpacing={12}>
          <Grid item sm={5} xs={12} sx={{ paddingLeft: "40px" }}>
            <Typography variant="h2">Lets Talk!</Typography>
            <Typography variant="h5">
              Ask us anything or just say hi..
              <br />
              <br />
              <br />
            </Typography>
          </Grid>
          <Grid className="form" item sm={7} xs={12} rowSpacing={3}>
            <Grid container rowSpacing={3} columnSpacing={5}>
              <Grid item xs={12}>
                <TextField
                  id="standard-read-only-input"
                  label="Name Surname"
                  variant="standard"
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  {...defaultProps}
                  id="disable-close-on-select"
                  disableCloseOnSelect
                  onInputChange={(event, newInputValue) => {
                    setCountry(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="standard"
                      error={!!errors.country}
                      helperText={errors.country}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl error={!!errors.gender}>
                  <FormLabel>Cinsiyet</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Kadın"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Erkek"
                    />
                  </RadioGroup>
                </FormControl>
                {errors.gender && (
                  <Typography color="error">{errors.gender}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-textarea"
                  label="Message"
                  placeholder=""
                  multiline
                  variant="standard"
                  fullWidth
                  onChange={(e) => setMessage(e.target.value)}
                  error={!!errors.message}
                  helperText={errors.message}
                />
              </Grid>
              <Grid item xs={5}>
                <Button variant="contained" onClick={sendMessage}>
                  Send
                </Button>
                {alert && (
                  <Alert
                    icon={<CheckIcon fontSize="inherit" />}
                    severity="success"
                  >
                    Mesaj Gönderildi
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Form;
