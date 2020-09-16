import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Patient, Entry, Diagnosis } from "../types";
import { useStateValue, updatePatient } from "../state";

const SinglePatientPage: React.FC = () => {
    const [{ patients, diagnoses }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();

    // useEffect(() => {
    //     //FIXME
    //     const fetchDiagnoses = async () => {
    //         console.log("fetching diagnoses");
    //         const { data: diagnoses } = await axios.get<Diagnosis>(`${apiBaseUrl}/diagnoses`);
    //         console.log('diagnoses', diagnoses);
    //     };
    //     fetchDiagnoses();
    // }, []);

    useEffect(() => {
        const findPatient = async () => {
            try {
                const { data: patientFromApi } = await axios.get<Patient>(
                    `${apiBaseUrl}/patients/${id}`
                );
                //dispatch({ type: "UPDATE_PATIENT", payload: patientFromApi });
                dispatch(updatePatient(patientFromApi));
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
    }, [dispatch, id, patients]);
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
                    <h3>entries</h3>
                    {patientToShow.entries && patientToShow.entries.map((entry: Entry) =>
                        <div key={entry.id}>
                            <p>{entry.date} {entry.description}</p>
                            {entry.diagnosisCodes &&
                                <ul>
                                    {entry.diagnosisCodes.map((diagnosis: string) =>
                                        <li key={diagnosis}>{diagnosis} {diagnoses.find((d: Diagnosis) =>
                                            d.code.valueOf() === diagnosis.valueOf())?.name}
                                        </li>
                                    )}
                                </ul>
                            }
                        </div>
                    )}
                </div>
            }
        </>
    );
};

export default SinglePatientPage;