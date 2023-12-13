'use client'
import { Box, Divider, Stack, Typography, TextField, IconButton, List } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

import Image from 'next/image';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import { TabMenu, TabPanel } from '@/components/tabs';
import { Circle } from '@mui/icons-material';
import { motion } from "framer-motion";





const padding = 4;

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(padding),
}));

function FlexItem({ children }) {
  return (
    <Box width={"100%"}>
      <Item>{children}</Item>
    </Box>
  )
}

function Section({ title, children, setEditMode }) {
  const theme = useTheme()

  return (
    <FlexItem>
      <Stack direction="column" gap={theme.spacing(3)}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 500 }}>{title}</Typography>
          {setEditMode && <IconButton aria-label="edit" size="small" sx={{ aspectRatio: "1/1" }} onClick={setEditMode}>
            <EditIcon fontSize="inherit" />
          </IconButton>}
        </Stack>
        {children}
      </Stack>
    </FlexItem>
  )
}

function SectionItems({ reverse, desc, children, newLine, icon }) {
  const theme = useTheme()
  return (
    <Grid item xs={newLine ? 12 : 6}>
      <Stack direction="row" alignItems="center" gap={theme.spacing(2)}>
        {icon && <div style={{ display: "flex", alignItems: "center", color: theme.palette.text.secondary }}>
          {icon}
        </div>}
        <Stack direction={reverse ? "column-reverse" : "column"} gap={theme.spacing(0)} sx={{ flex: 1 }}>
          {desc && <Typography sx={{ color: theme.palette.text.secondary, textTransform: "capitalize" }} variant="body2">{desc}</Typography>}
          {children}
        </Stack>
      </Stack>
    </Grid>
  )
}

function TextInputField({ edit, value, setValue, censored, multiline }) {

  const [visible, setVisible] = useState(false)

  const toggleVisible = (e) => {
    setVisible(!visible)
  }

  return (
    <Box>
      <Stack direction="row">
        <TextField
          hiddenLabel
          defaultValue={!value && !edit ? "——" : value}
          variant="standard"
          size="small"
          type={censored && !visible ? "password" : "text"}
          required
          onChange={(e) => setValue(e)}
          fullWidth
          multiline={multiline}

          InputProps={{
            disableUnderline: !edit,
            readOnly: !edit,
          }}
        />
        {censored && value && <IconButton size="small" onClick={toggleVisible}>
          {!visible && <VisibilityIcon />} {visible && <VisibilityOffIcon />}
        </IconButton>
        }

      </Stack>
    </Box>
  )
}

function DateInputField({ edit, value, setValue }) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {(value || edit) &&
        <DatePicker
          defaultValue={value || dayjs(new Date())}
          disableOpenPicker={!edit}
          onChange={(e) => setValue(e)}
          slotProps={{
            disableUnderline: !edit, textField: {
              variant: "standard", size: 'small', readOnly: !edit, InputProps: {
                disableUnderline: !edit
              }
            }
          }}
        />
      }
      {(!value && !edit) && <TextInputField value={"——"} />}
    </LocalizationProvider>
  )
}

function EditableSection({ setEditMode, title, children }) {
  const theme = useTheme()

  return (
    <Section setEditMode={setEditMode} title={title}>
      <Grid container columnSpacing={theme.spacing(padding)} rowSpacing={theme.spacing(1.5)}>
        {children}
      </Grid>
    </Section>
  )
}

function PersonalInfo() {

  const [edit, setEditMode] = useState(false)
  const [fname, setFName] = useState("fragile")
  const [lname, setLName] = useState("banana")
  const [uname, setUName] = useState("fragilebanana")
  const [pwd, setPWD] = useState("123456789")
  const [dob, setDOB] = useState(dayjs(new Date(2000, 0, 1)))
  const [gender, setGender] = useState("male")

  const toggleEdit = (e) => {
    setEditMode(!edit)
  }

  return (
    <EditableSection setEditMode={toggleEdit} title={"Personal Information"}>
      <SectionItems desc={"First Name"}>
        <TextInputField value={fname} edit={edit} setValue={setFName}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Last Name"}>
        <TextInputField value={lname} edit={edit} setValue={setLName}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Birthday"} newLine>
        <DateInputField value={dob} edit={edit} setValue={setDOB}></DateInputField>
      </SectionItems>
      <SectionItems desc={"Gender"} newLine>
        <TextInputField value={gender} edit={edit} setValue={setGender}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Username"}>
        <TextInputField value={uname} edit={edit} setValue={setUName}></TextInputField>
      </SectionItems>
      <SectionItems desc={"password"}>
        <TextInputField value={pwd} edit={edit} setValue={setPWD} censored></TextInputField>
      </SectionItems>
    </EditableSection>
  )
}

function EducationInfo() {
  const [edit, setEditMode] = useState(false)
  const [level, setLevel] = useState("Primary School")
  const [levelGrad, setLevelGrad] = useState(dayjs(new Date(2010, 2, 14)))
  const [current, setCurrent] = useState(null)
  const [currentGrad, setCurrentGrad] = useState(null)
  const [skills, setSkills] = useState(["play computer games", "write programs", "fix computer"])
  const [address, setAddress] = useState("Leung Wai House, 41, Castle Peak Range Road, Tuen Mun, Tuen Mun District")

  var key = 0

  const toggleEdit = (e) => {
    setEditMode(!edit)
  }

  return (
    <EditableSection setEditMode={toggleEdit} title={"Education"}>
      <SectionItems desc={"Highest Level of Education"}>
        <TextInputField value={level} edit={edit} setValue={setLevel}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Date of Graduation"}>
        <DateInputField value={levelGrad} edit={edit} setValue={setLevelGrad}></DateInputField>
      </SectionItems>
      <SectionItems desc={"Current Education"}>
        <TextInputField value={current} edit={edit} setValue={setCurrent}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Expected Graduation Date"}>
        <DateInputField value={currentGrad} edit={edit} setValue={setCurrentGrad}></DateInputField>
      </SectionItems>
      <SectionItems desc={"Skill Set"} newLine>
        <List>
          {skills.map((e, index) => {
            return (
              <Stack key={key++} direction="row" alignItems="center" gap={1}>
                <Circle fontSize='smaller' />
                <TextInputField key={index} value={e} edit={edit} setValue={setLevel}></TextInputField>
              </Stack>
            )
          })}
        </List>
      </SectionItems>
    </EditableSection>
  )
}

function ContactInfo() {
  const [edit, setEditMode] = useState(false)
  const [email, setEmail] = useState("fragilebanana@outlook.com")
  const [phone, setPhone] = useState("12345678")
  const [address, setAddress] = useState("Leung Wai House, 41, Castle Peak Range Road, Tuen Mun, Tuen Mun District")

  const toggleEdit = (e) => {
    setEditMode(!edit)
  }

  return (
    <EditableSection setEditMode={toggleEdit} title={"Contact"}>
      <SectionItems desc={"Email"}>
        <TextInputField value={email} edit={edit} setValue={setEmail}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Phone"}>
        <TextInputField value={phone} edit={edit} setValue={setPhone}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Address"} newLine>
        <TextInputField value={address} edit={edit} setValue={setAddress} multiline></TextInputField>
      </SectionItems>
    </EditableSection>
  )
}

function EmergencyContactInfo() {
  const [edit, setEditMode] = useState(false)
  const [name, setName] = useState("Cunning Apple")
  const [phone, setPhone] = useState("87654321")
  const [relation, setRelation] = useState("Brother")

  const toggleEdit = (e) => {
    setEditMode(!edit)
  }

  return (
    <EditableSection setEditMode={toggleEdit} title={"Emergency Contact"}>
      <SectionItems desc={"Name"}>
        <TextInputField value={name} edit={edit} setValue={setName}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Phone"}>
        <TextInputField value={phone} edit={edit} setValue={setPhone}></TextInputField>
      </SectionItems>
      <SectionItems desc={"Relation"}>
        <TextInputField value={relation} edit={edit} setValue={setRelation}></TextInputField>
      </SectionItems>
    </EditableSection>
  )
}

function Summery() {

  return (
    <Section title={"Summery"}>
    </Section>
  )
}

function InfoCard() {

  const theme = useTheme()

  const [name, setName] = useState("fragile banana")
  const [position, setPosition] = useState("IT support")

  const [value, setValue] = useState(0);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        height: "fit-content",
        width: 300,
        paddingBottom: 4
      }}
    >

      <TabMenu
        value={value}
        handleChange={handleChange}
        tabs={["Info", "Quick Actions"]}
        variant="scrollable"
        scrollButtons="auto"
      />
      <TabPanel value={value} index={0}>
        <Stack justifyContent="center" gap={theme.spacing(3)}>
          <Stack gap={theme.spacing(2)} alignItems={"center"}>
            <Paper
              sx={{
                maxWidth: `calc(100% - ${theme.spacing(padding * 2)})`,
                aspectRatio: "1/1",
                position: 'relative',
              }}
            >
              <Image width="200" height="200" src='/image/avatar.png'
                style={{
                  objectFit: 'cover',
                  width: "100%",
                  height: "100%",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  borderRadius: 5,
                }} />

              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: theme.spacing(1),
                  right: theme.spacing(1),
                  height: 40,
                  width: 40,
                }}
              >
                <Paper elevation={1}
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "50%",
                  }}
                >
                  <EditIcon
                    sx={{
                      height: 40,
                      width: 40,
                      padding: theme.spacing(1),
                    }}
                  />
                </Paper>
              </IconButton>

            </Paper>
            <Stack gap={theme.spacing(.25)}>
              <Typography sx={{ fontWeight: 500, textTransform: "capitalize", textAlign: "center" }} variant="h4">{name}</Typography>
              <Typography sx={{ color: theme.palette.text.secondary, textTransform: "capitalize", textAlign: "center" }} variant="body1">{position}</Typography>
            </Stack>

            <Divider flexItem />
          </Stack>


          <Stack gap={theme.spacing(3)} paddingX={theme.spacing(4)}>
            <SectionItems desc="phone" icon={<PhoneIcon />}>
              12345678
            </SectionItems>
            <SectionItems desc="email" icon={<EmailIcon />}>
              fragilebanana@123.com
            </SectionItems>
            <SectionItems desc="contract" icon={<WorkIcon />}>
              Full Time (12/01/2024)
            </SectionItems>
            <SectionItems desc="start date" icon={<PunchClockIcon />}>
              10/8/2019
            </SectionItems>
            <Divider flexItem />
            <SectionItems icon={<Circle sx={{ color: "green" }} />}>
              No Assignment
            </SectionItems>
            <SectionItems reverse desc="last seen 11:30(19/01/2023)" icon={<Circle sx={{ color: "gray" }} />}>
              Offline
            </SectionItems>
          </Stack>
        </Stack>
      </TabPanel>
    </Box>
  )
}



export default function Home() {
  const theme = useTheme()

  const [name, setName] = useState("fragile banana")
  const [position, setPosition] = useState("IT support")

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box paddingTop={theme.spacing(2)}>
      <Stack direction="row" gap={theme.spacing(padding)} >
        <InfoCard />
        <Box sx={{ flex: "1" }}>
          <TabMenu
            value={value}
            handleChange={handleChange}
            tabs={["Details", "Leave", "Job", "Equiptment", "Schedule"]}
          />
          <TabPanel value={value} index={0}>
            <Stack gap={theme.spacing(padding)}>
              {false && <Summery />}
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={padding}
              >
                <Stack
                  sx={{ flex: 1 }}
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={padding}
                >
                  <PersonalInfo />
                  <EducationInfo />
                </Stack>
                <Stack
                  sx={{ flex: 1 }}
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={padding}
                >
                  <ContactInfo />
                  <EmergencyContactInfo />

                </Stack>
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            dwadwadwad
          </TabPanel>
        </Box>
      </Stack>

    </Box>
  )
}
