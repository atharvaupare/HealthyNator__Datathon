import mongoose from "mongoose";
// Importing PostMessage schema
import Patient from "../models/patientUser.js";
// Create a new patient user
import Doctor from "../models/doctorUser.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getPatients = async (req, res) => {
  try {
    const patientMessages = await Patient.find();
    res.status(200).json(patientMessages);
    console.log("Get Request Successful");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPatient = async (req, res) => {
  const {
    name,
    email,
    gender,
    contactno,
    address,
    bloodgroup,
    allergies,
    medicalhistory,
    currentmedication,
    familymedicalhistory,
    password,
    confirmPassword,
    age,
    height,
    weight,
    id,
  } = req.body;
  console.log(req.body);
  try {
    console.log("Test 1");
    const existingUser = await Patient.findOne({ email });
    console.log("Test 2");
    if (existingUser) {
      console.log("Test 3");
      return res.status(400).json({ message: "User already exists" });
    } else {
      console.log("Test 3");
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }

      try {
        console.log("Test 4");

        const hashedPassword = await argon2.hash(password);

        console.log(hashedPassword);

        console.log("Test 5");

        const newUser = new Patient({
          age,
          gender,
          height,
          weight,
          name,
          email,
          contactno,
          address,
          bloodgroup,
          allergies,
          medicalhistory,
          currentmedication,
          familymedicalhistory,
          password: hashedPassword,
          createdAt: new Date(),
          id,
        });

        await newUser.save();

        var token = jwt.sign(
          { email: newUser.email, id: newUser._id, name: `${name}` },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ result: newUser, token });
      } catch (err) {
        console.log(err);
      }

      console.log("Test 6 - Success");
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctorMessages = await Doctor.find();
    res.status(200).json(doctorMessages);
    console.log("Get Request Successful");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const createDoctor = async (req, res) => {
  const {
    name,
    email,
    contactno,
    address,
    specialisation,
    experience,
    password,
    confirmPassword,
    id,
  } = req.body;
  console.log(req.body);
  try {
    console.log("Test 1");
    const existingUser = await Doctor.findOne({ email });
    console.log("Test 2");
    if (existingUser) {
      console.log("Test 3");
      return res.status(400).json({ message: "User already exists" });
    } else {
      console.log("Test 3");
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }

      try {
        console.log("Test 4");

        const hashedPassword = await argon2.hash(password);

        console.log(hashedPassword);

        console.log("Test 5");

        const newUser = new Doctor({
          name,
          email,
          contactno,
          address,
          specialisation,
          experience,
          password: hashedPassword,
          joinedOn: new Date(),
          id,
        });

        await newUser.save();

        var token = jwt.sign(
          { email: newUser.email, id: newUser._id, name: `${name}` },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ result: newUser, token });
      } catch (err) {
        console.log(err);
      }

      console.log("Test 6 - Success");
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getCustomPatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById({email: id})
    res.status(200).json(patient);
  }
  catch (err) {
    res.status(404).json({ message: err.message });
  }
}
