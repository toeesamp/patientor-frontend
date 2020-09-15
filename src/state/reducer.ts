import { State } from "./state";
import { Patient } from "../types";

export type Action =
    | {
        type: "SET_PATIENT_LIST";
        payload: Patient[];
    }
    | {
        type: "ADD_PATIENT";
        payload: Patient;
    }
    | {
        type: "UPDATE_PATIENT";
        payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_PATIENT_LIST":
            return {
                ...state,
                patients: {
                    ...action.payload.reduce(
                        (memo, patient) => ({ ...memo, [patient.id]: patient }),
                        {}
                    ),
                    ...state.patients
                }
            };
        case "ADD_PATIENT":
            return {
                ...state,
                patients: {
                    ...state.patients,
                    [action.payload.id]: action.payload
                }
            };
        case "UPDATE_PATIENT":
            // console.log('patients', state.patients);
            console.log('tullaanko tänne');
            // console.log('payload', action.payload);
            // console.log('state', state);
            // console.log('patients as objects before', Object.values(state.patients));
            // console.log('action payload id', action.payload.id);
            // const test = Object.values(state.patients);
            // console.log('patients as objects before', test);

            // const match = test.find((patient: Patient) => patient.id === action.payload.id);
            // if (match)
            //     console.log('match', match.id === action.payload.id);

            // // Object.values(state.patients).map((patient: Patient) => {
            // const test2 = test.map((patient: Patient) => {
            //     if (patient.id === action.payload.id) {
            //         console.log('match ', patient.id, patient.name);
            //         return {...patient, ssn: action.payload.ssn , entries: action.payload.entries };
            //     }
            //     return patient;
            //     // patient.id !== action.payload.id ? patient : action.payload;
            // });

            // console.log('patients as objects after', test2);

            // state.patients.map((patient: Patient) => console.log(patient));
            // return {...state};
            return {
                ...state,
                patients: {
                    ...state.patients,
                    [action.payload.id]: action.payload
                }
            };
            // const test = action.payload as Patient;
            // return {
            //     ...state,
            //     //TODO se perus update map rimpsu?
            //     patients: {
            //         Object.values(state.patients).map((patient: Patient) => patient.id !== action.payload.id
            //             ? patient : action.payload);
            //     }
            // };
        default:
            return state;
    }
};
