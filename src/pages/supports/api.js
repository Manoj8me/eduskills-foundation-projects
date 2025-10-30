// const API_BASE = "http://localhost:8000/api"; // Change to your backend URL
import axios from "axios";
export const API_BASE = "https://erpapi.eduskillsfoundation.org/aiservices";
export const BAse_API = "https://erpapi.eduskillsfoundation.org/internship";

// Helper function for POST requests
const postRequest = async (url, body) => {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { message: "Error connecting to server" };
  }
};

// ---------- GET ----------
export const getDomains = async () => {
  try {
    const res = await fetch(`${API_BASE}/domains`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return { message: "Error connecting to server" };
  }
};

// // Get weeks for a specific domain
export const getAcademyWeeks = async (domainNumber) => {
  const response = await axios.post(`${API_BASE}/academyWeeks`, {
    domainNumber: domainNumber,
  });
  return response.data;
};

export const getAcademyModules = async (week_id, domainNumber = null) => {
  try {
    const response = await axios.post(`${API_BASE}/academyModules`, {
      weekNumber: week_id,
      domainNumber: domainNumber,
    });

    return response.data; // This will be an array of modules
  } catch (error) {
    console.error("Error fetching academy modules:", error);
    return [];
  }
};

// Ongoing Process Document Support API

export const ongoingProcessDocumentSupport = async (
  domainNumber,
  domainNumber2 = null
) => {
  try {
    const response = await axios.post(
      `${BAse_API}/ongoingProcessDocumentSupport`,
      { domainNumber, domainNumber2 } // sending data in body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ongoing process document:", error);
    throw error;
  }
};

// ---------- POST ----------
export const getAcademySteps = (moduleNumber) =>
  postRequest("/academySteps", { moduleNumber });

export const addAcademyWeek = (data) => postRequest("/academyWeeksAdd", data);
export const addAcademyModule = (data) =>
  postRequest("/academyModulesAdd", data);
export const addAcademyStep = (data) => postRequest("/academyStepsAdd", data);

export const updateAcademyWeek = (data) =>
  postRequest("/academyWeeksUpdate", data);
export const updateAcademyModule = (data) =>
  postRequest("/academyModulesUpdate", data);
export const updateAcademyStep = (data) =>
  postRequest("/academyStepsUpdate", data);

export const saveStepDocument = (data) =>
  postRequest("/academySaveDocuments", data);
export const getDomainSidebar = (domainNumber) =>
  postRequest("/academyDomainsSidebar", { domainNumber });
