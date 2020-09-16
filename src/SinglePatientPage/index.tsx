import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Patient, Entry, Diagnosis, HealthCheckRating, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry } from "../types";
import { useStateValue, updatePatient } from "../state";

const SinglePatientPage: React.FC = () => {
    const [{ patients, diagnoses }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();

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

                            <EntryDetails entry={entry} diagnoses={diagnoses} />
                        </div>
                    )}
                </div>
            }
        </>
    );
};

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const EntryDetails: React.FC<{ entry: Entry; diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
    switch (entry.type) {
        case "Hospital":
            return <HospitalEntryComponent entry={entry} diagnoses={diagnoses} />;
        case "OccupationalHealthcare":
            return <OccupationalHealthcareEntryComponent entry={entry} diagnoses={diagnoses} />;
        case "HealthCheck":
            return <HealthCheckEntryComponent entry={entry} diagnoses={diagnoses} />;
        default:
            return assertNever(entry);
    }
};


const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
};

const HospitalEntryComponent: React.FC<{ entry: HospitalEntry; diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
    return (
        <div style={style}>
            <h3>Hospital {entry.date}</h3>
            <p>{entry.description}</p>
            {entry.diagnosisCodes &&
                <DiagnosisCodesComponent entry={entry} diagnoses={diagnoses} />
            }
        </div>
    );
};

const OccupationalHealthcareEntryComponent: React.FC<{ entry: OccupationalHealthcareEntry; diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
    return (
        <div style={style}>
            <h3>Occupational healthcare {entry.date}</h3>
            <p>{entry.description}</p>
            {entry.diagnosisCodes &&
                <DiagnosisCodesComponent entry={entry} diagnoses={diagnoses} />
            }
        </div>

    );
};

const HealthCheckEntryComponent: React.FC<{ entry: HealthCheckEntry; diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
    return (
        <div style={style}>
            <h3>Health check {entry.date}</h3>
            <p>{entry.description}</p>
            <p>Health rating: {HealthCheckRating[entry.healthCheckRating]}</p>
            {entry.diagnosisCodes &&
                <DiagnosisCodesComponent entry={entry} diagnoses={diagnoses} />
            }
        </div>
    );
};

const DiagnosisCodesComponent: React.FC<{ entry: Entry; diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
    return (
        <ul>
            {entry.diagnosisCodes?.map((diagnosis: string) =>
                <li key={diagnosis}>{diagnosis} {diagnoses.find((d: Diagnosis) =>
                    d.code.valueOf() === diagnosis.valueOf())?.name}
                </li>
            )}
        </ul>
    );
};


export default SinglePatientPage;