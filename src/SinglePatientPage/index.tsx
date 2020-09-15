import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { useStateValue } from "../state";

const SinglePatientPage: React.FC = () => {
    const [{ patients }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const findPatient = async () => {
            try {
                const { data: patientFromApi } = await axios.get<Patient>(
                    `${apiBaseUrl}/patients/${id}`
                );
                dispatch({ type: "UPDATE_PATIENT", payload: patientFromApi });
            } catch (e) {
                console.error(e);
            }
        };
        console.log('url id', id);
        const match = Object.values(patients).find(patient => patient.id === id);
        console.log('match', match);

        // If the patient has ssn it has already been retrieved 
        if (!Object.values(patients).find(patient => patient.id === id)?.ssn) {
            findPatient();
        }
    }, [dispatch, id, patients]); //onko tää oikein?
    // }, []);

    const patientToShow: Patient | undefined = Object.values(patients).find(patient => patient.id === id);

    return (
        <>
            {patientToShow &&
                <div>
                    <h2>{patientToShow?.name}</h2>
                    <p>{patientToShow.gender}</p>
                    <p>ssn: {patientToShow.ssn}</p>
                    <p>occupation: {patientToShow.occupation}</p>
                </div>
            }
        </>
    );
};

export default SinglePatientPage;